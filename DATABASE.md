# LexiMatch German A1 Database Diagram (PostgreSQL ERD)

## Tables

### Categories
| Column | Type | Key |
|---|---|---|
| id | serial | PK |
| name | varchar | |
| created_at | timestamp | |

### LearningSets
| Column | Type | Key |
|---|---|---|
| id | serial | PK |
| category_id | int | FK → Categories.id |
| name | varchar | |
| description | text | |

### VocabularyItems
| Column | Type | Key |
|---|---|---|
| item_id | varchar | PK |
| german_word | varchar | |
| english_meaning | varchar | |
| article_id | int | FK → Articles.id |
| word_type_id | int | FK → WordTypes.id |
| learning_set_id | int | FK → LearningSets.id |
| difficulty_level_id | int | FK → DifficultyLevels.id |
| image_idea | text | |

### Articles
| Column | Type | Key |
|---|---|---|
| id | serial | PK |
| name / text | varchar | |

> Note: the source diagram shows two separate "Articles" boxes (one near VocabularyItems with columns `id`, `text`, and one at the bottom with columns `id`, `name`). These likely represent the same table — you may want to consolidate them into a single `Articles` table when implementing.

### WordTypes
| Column | Type | Key |
|---|---|---|
| id | serial | PK |
| name | varchar | |

### DifficultyLevels
| Column | Type | Key |
|---|---|---|
| id | serial | PK |
| level_name | varchar | |

### Users
| Column | Type | Key |
|---|---|---|
| id | uuid | PK |
| username | varchar | |
| email | varchar | |
| created_at | timestamp | |
| xp_total | int | |

### UserProgress
| Column | Type | Key |
|---|---|---|
| id | serial | PK |
| user_id | uuid | FK → Users.id |
| item_id | varchar | FK → VocabularyItems.item_id |
| status | learning_status enum (`new`, `learning`, `mastered`) | |
| next_review_date | date | |
| review_count | int | |
| correct_count | int | |

### GameLeaderboard
| Column | Type | Key |
|---|---|---|
| id | serial | PK |
| user_id | uuid | FK → Users.id |
| score | int | |
| date_recorded | date | |

> Note: the diagram shows two `GameLeaderboard` boxes with identical structure (one linked from `Users`, one linked from `UserProgress`). These appear to be duplicates of the same table.

## Relationships

- **Categories → LearningSets** (1‑to‑many via `category_id`)
- **LearningSets → VocabularyItems** (1‑to‑many via `learning_set_id`)
- **Articles → VocabularyItems** (1‑to‑many via `article_id`)
- **WordTypes → VocabularyItems** (1‑to‑many via `word_type_id`)
- **DifficultyLevels → VocabularyItems** (1‑to‑many via `difficulty_level_id`)
- **Users → UserProgress** (1‑to‑many via `user_id`)
- **VocabularyItems → UserProgress** (1‑to‑many via `item_id`)
- **Users → GameLeaderboard** (1‑to‑many via `user_id`)
- **UserProgress → GameLeaderboard** (as drawn, though this looks like it should logically be `Users → GameLeaderboard` only)

## Notation (legend from diagram)

| Symbol | Meaning |
|---|---|
| **PK** | serial primary key |
| → | varchar |
| < | foreign key relationship (crow's foot) |
| **FK** | linking/foreign key column |

## Suggested PostgreSQL DDL sketch

```sql
CREATE TYPE learning_status AS ENUM ('new', 'learning', 'mastered');

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE learning_sets (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id),
    name VARCHAR NOT NULL,
    description TEXT
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE word_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE difficulty_levels (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR NOT NULL
);

CREATE TABLE vocabulary_items (
    item_id VARCHAR PRIMARY KEY,
    german_word VARCHAR NOT NULL,
    english_meaning VARCHAR NOT NULL,
    article_id INT REFERENCES articles(id),
    word_type_id INT REFERENCES word_types(id),
    learning_set_id INT REFERENCES learning_sets(id),
    difficulty_level_id INT REFERENCES difficulty_levels(id),
    image_idea TEXT
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    xp_total INT DEFAULT 0
);

CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    item_id VARCHAR REFERENCES vocabulary_items(item_id),
    status learning_status DEFAULT 'new',
    next_review_date DATE,
    review_count INT DEFAULT 0,
    correct_count INT DEFAULT 0
);

CREATE TABLE game_leaderboard (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    score INT DEFAULT 0,
    date_recorded DATE DEFAULT CURRENT_DATE
);
```
