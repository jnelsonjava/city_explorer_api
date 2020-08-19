-- This line is not production safe code !DONT DO IT ON THE JOB
DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude CHAR(255),
  longitude CHAR(255)
);