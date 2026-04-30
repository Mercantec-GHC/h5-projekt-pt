-- CreateTable
CREATE TABLE `Sessions` (
    `userId` INTEGER NOT NULL,
    `sessionId` INTEGER NOT NULL,

    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
