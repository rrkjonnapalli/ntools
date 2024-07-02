CREATE TABLE `ingestion_config` (
  `id` text PRIMARY KEY NOT NULL,
  `db_path` text,
  `table_name` text,
  `last_run_at` datetime,
  `status` text,
  `created_at` timestamp
);

CREATE TABLE `runs` (
  `id` text PRIMARY KEY NOT NULL,
  `ingestion_config_id` text,
  `ingestion_path` text,
  `status` text,
  `info` text,
  `created_at` datetime DEFAULT 'current_timestamp',
  `started_at` datetime,
  `completed_at` datetime,
  FOREIGN KEY (ingestion_config_id) REFERENCES ingestion_config(id)
);

-- ALTER TABLE child ADD COLUMN parent_id INTEGER REFERENCES parent(id); -- parent_id should not be in child table
-- ALTER TABLE `ingestion_config` ADD FOREIGN KEY (`id`) REFERENCES `runs` (`ingestion_config_id`);
