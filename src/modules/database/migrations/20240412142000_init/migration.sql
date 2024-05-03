-- CreateTable
CREATE TABLE `Player` (
    `userName` VARCHAR(50) NOT NULL,
    `mu` DOUBLE NOT NULL,
    `sigma` DOUBLE NOT NULL,
    `ordinal` DOUBLE NOT NULL,
    `lost` INTEGER NOT NULL DEFAULT 0,
    `win` INTEGER NOT NULL DEFAULT 0,
    `createdAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Player_userName_key`(`userName`),
    INDEX `Player_userName_idx`(`userName`),
    INDEX `Player_ordinal_idx`(`ordinal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
