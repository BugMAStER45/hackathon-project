import os
import json
import logging
import asyncio
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger("heatshield.db")

class InMemoryAsyncCollection:
    """A resilient async in-memory / JSON-backed collection mimicking Motor collection API."""
    def __init__(self, name: str):
        self.name = name
        self._data: List[Dict[str, Any]] = []

    async def insert_one(self, doc: Dict[str, Any]):
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(len(self._data) + 1)
        self._data.append(doc_copy)
        return type("InsertResult", (), {"inserted_id": doc_copy["_id"]})()

    async def insert_many(self, docs: List[Dict[str, Any]]):
        ids = []
        for d in docs:
            res = await self.insert_one(d)
            ids.append(res.inserted_id)
        return type("InsertManyResult", (), {"inserted_ids": ids})()

    async def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None):
        query = query or {}
        results = []
        for item in self._data:
            match = True
            for k, v in query.items():
                if isinstance(v, dict):
                    if "$gte" in v and item.get(k, 0) < v["$gte"]:
                        match = False
                    if "$lte" in v and item.get(k, 0) > v["$lte"]:
                        match = False
                    if "$gt" in v and item.get(k, 0) <= v["$gt"]:
                        match = False
                    if "$lt" in v and item.get(k, 0) >= v["$lt"]:
                        match = False
                    if "$in" in v and item.get(k) not in v["$in"]:
                        match = False
                elif item.get(k) != v:
                    match = False
            if match:
                results.append(item)
        
        class AsyncCursor:
            def __init__(self, items):
                self.items = items
            def __aiter__(self):
                self._iter = iter(self.items)
                return self
            async def __anext__(self):
                try:
                    return next(self._iter)
                except StopIteration:
                    raise StopAsyncIteration
            async def to_list(self, length: Optional[int] = None):
                if length is None:
                    return list(self.items)
                return list(self.items[:length])
        
        return AsyncCursor(results)

    async def find_one(self, query: Dict[str, Any]):
        cursor = await self.find(query)
        items = await cursor.to_list(1)
        return items[0] if items else None

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        target = await self.find_one(query)
        if target:
            if "$set" in update:
                target.update(update["$set"])
            else:
                target.update(update)
            return type("UpdateResult", (), {"modified_count": 1, "matched_count": 1})()
        elif upsert:
            new_doc = dict(query)
            if "$set" in update:
                new_doc.update(update["$set"])
            await self.insert_one(new_doc)
            return type("UpdateResult", (), {"modified_count": 1, "matched_count": 0, "upserted_id": new_doc.get("_id")})()
        return type("UpdateResult", (), {"modified_count": 0, "matched_count": 0})()

    async def delete_many(self, query: Dict[str, Any]):
        initial_len = len(self._data)
        self._data = [
            d for d in self._data 
            if not all(d.get(k) == v for k, v in query.items() if not isinstance(v, dict))
        ]
        return type("DeleteResult", (), {"deleted_count": initial_len - len(self._data)})()

    async def count_documents(self, query: Optional[Dict[str, Any]] = None):
        if not query:
            return len(self._data)
        cursor = await self.find(query)
        items = await cursor.to_list()
        return len(items)

    async def create_index(self, keys, **kwargs):
        return f"idx_{self.name}"

class DatabaseManager:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.is_connected_to_mongo = False
        self._fallback_collections: Dict[str, InMemoryAsyncCollection] = {}

    async def connect(self):
        try:
            # Try connecting with short timeout
            client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
            # Verify connection
            await client.admin.command('ping')
            self.client = client
            self.db = client[settings.DB_NAME]
            self.is_connected_to_mongo = True
            logger.info("Successfully connected to live MongoDB server!")
            
            # Setup 2dsphere indexes
            try:
                await self.db.pedestrian_zones.create_index([("location", "2dsphere")])
                await self.db.cooling_stations.create_index([("location", "2dsphere")])
                await self.db.heat_telemetry.create_index([("city", 1), ("timestamp", -1)])
            except Exception as e:
                logger.warning(f"Index creation notice: {e}")
        except Exception as e:
            logger.warning(f"MongoDB connection failed: {e}. Utilizing fast resilient in-memory geospatial store.")
            self.is_connected_to_mongo = False
            self.db = None

    def get_collection(self, name: str):
        if self.is_connected_to_mongo and self.db is not None:
            return self.db[name]
        if name not in self._fallback_collections:
            self._fallback_collections[name] = InMemoryAsyncCollection(name)
        return self._fallback_collections[name]

    async def disconnect(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB client connection closed.")

db_manager = DatabaseManager()
