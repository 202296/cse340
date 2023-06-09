select * from movie;



ALTER TABLE 
  movie
ALTER COLUMN 
  description TYPE TEXT;



CREATE TABLE movie 
	(movie_id INTEGER NOT NULL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	'description' VARCHAR(255) NOT NULL,
	category VARCHAR(100) NOT NULL,
	price FLOAT NOT NULL,
	'length' INTEGER NOT NULL,
	rating CHAR(10) NULL,
	actorS VARCHAR NOT NULL);


DROP TABLE movie;


CREATE TABLE movie 
	(movie_id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	category VARCHAR(100) NOT NULL,
	price FLOAT NOT NULL,
	"length" INTEGER NOT NULL,
	rating CHAR(10) NULL,
	actorS TEXT NOT NULL);


ALTER TABLE
  movie
ALTER COLUMN 
 actors 
TYPE 
  TEXT;


INSERT INTO movie
	(title, 
    "description", 
    category, 
    price, 
    "length", 
    rating, 
    actors)
VALUES
	('ACADEMY DINOSAUR',
    'A Epic Drama of a Feminist And a Mad Scientist who must Battle a Teacher in The Canadian Rockies',
    'Documentary',
    0.99,
    86,
    'PG', 'WARREN NOLTE, OPRAH KILMER, ROCK DUKAKIS, MENA TEMPLE, JOHNNY CAGE, SANDRA PECK, CHRISTIAN GABLE, PENELOPE GUINESS, LUCILLE TRACY, MARY KEITEL'),
	('ACE GOLDFINGER', 
    'A Astounding Epistle of a Database Administrator And a Explorer who must Find a Car in Ancient China', 'Horror', 
    4.99,
     48,
      'G',
       'CHRIS DEPP SEAN GUINESS, MINNIE ZELLWEGER, BOB FAWCETT'),
	('ADAPTATION HOLES',
     'A Astounding Reflection of a Lumberjack And a Car who must Sink a Lumberjack in A Baloon Factory', 'Documentary', 
     2.99, 
     50, 
     'NC-17', 
     'BOB FAWCETT CAMERON STREEP, NICK WAHLBERG, RAY JOHANSSON, JULIANNE DENCH'),
	('AFFAIR PREJUDICE', 
    'A Fanciful Documentary of a Frisbee And a Lumberjack who must Chase a Monkey in A Shark Tank',	
    'Horror', 
    2.99, 
    117, 
    'G', 
    'OPRAH KILMER FAY WINSLET, KENNETH PESCI, JODIE DEGENERES, SCARLETT DAMON'),
	('AFRICAN EGG', 
    'A Fast-Paced Documentary of a Pastry Chef And a Dentist who must Pursue a Forensic Psychologist in The Gulf of Mexico', 
    'Family', 
    2.99, 
    130, 
    'G', 
    'GARY PHOENIX DUSTIN TAUTOU, MATTHEW LEIGH, MATTHEW CARREY, THORA TEMPLE'),
	('AGENT TRUMAN', 
    'A Intrepid Panorama of a Robot And a Boy who must Escape a Sumo Wrestler in Ancient China', 'Foreign', 2.99, 
    169, 
    'PG', 
    'WARREN NOLTE JAYNE NEESON, KIRSTEN PALTROW, SANDRA KILMER, REESE WEST, KENNETH HOFFMAN, MORGAN WILLIAMS'),
	('AIRPLANE SIERRA', 
    'A Touching Saga of a Hunter And a Butler who must Discover a Butler in A Jet Boat', 
    'Comedy',
    4.99,
    62, 
    'PG-13', 
    'MICHAEL BOLGER MENA HOPPER, JIM MOSTEL, RICHARD PENN, OPRAH KILMER'),
	('AIRPORT POLLOCK', 
    'A Epic Tale of a Moose And a Girl who must Confront a Monkey in Ancient India', 
    'Horror', 
    4.99, 
    54, 
    'R', 
    'LUCILLE DEE FAY KILMER, GENE WILLIS, SUSAN DAVIS'),
	('ALABAMA DEVIL', 
    'A Thoughtful Panorama of a Database Administrator And a Mad Scientist who must Outgun a Mad Scientist in A Jet Boat', 
    'Horror', 
    2.99, 
    114, 
    'PG-13', 
    'ELVIS MARX RIP CRAWFORD, MENA TEMPLE, RIP WINSLET, WARREN NOLTE, GRETA KEITEL, MERYL ALLEN, CHRISTIAN GABLE, WILLIAM HACKMAN'),
	('ALADDIN CALENDAR', 
    'A Action-Packed Tale of a Man And a Lumberjack who must Reach a Feminist in Ancient China', 
    'Sports', 
    4.99, 
    63, 
    'NC-17', 
    'JADA RYDER ROCK DUKAKIS, GRETA MALDEN, RENEE TRACY, RAY JOHANSSON, VAL BOLGER, JUDY DEAN, ALEC WAYNE');


UPDATE 
  movie 
Set
  category = 'Terror'
WHERE 
 movie_id = 2;



SELECT 
  * 
FROM 
  movie 
WHERE 
  price > 2.99;








INSERT INTO account
  (account_firstname, 
  account_lastname, 
  account_email, 
  account_password)
VALUES
  ('Tony', 
  'Stark', 
  'tony@starkent.com', 
  'Iam1ronM@n');


UPDATE 
  account
SET 
  account_type = 'Admin'
WHERE 
  account_id = 1 ;



DELETE FROM 
  account 
WHERE 
  account_id = 1;



SELECT 
  inventory.inv_make,
  inventory.inv_model,
  classification.classification_name 
FROM 
  inventory
INNER JOIN 
  classification 
ON 
  inventory.inv_id = classification.classification_id;


UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
    
    
    
    
    
    









UPDATE account
-- SET account_email = REPLACE(account_email, 'small interiors', 'a huge interior');
