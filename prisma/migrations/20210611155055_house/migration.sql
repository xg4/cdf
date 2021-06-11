-- CreateTable
CREATE TABLE "houses" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "region" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "started_at" DATETIME NOT NULL,
    "finished_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "hash" TEXT NOT NULL
);
