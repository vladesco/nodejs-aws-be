DROP TABLE IF EXISTS Products CASCADE;
DROP TABLE IF EXISTS Stocks;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Products 
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(9,2) CHECK (price >= 0),
    image TEXT
);

CREATE TABLE Stocks
(
    product_id UUID REFERENCES Products(id) ON DELETE CASCADE,
    count INTEGER CHECK (count >= 0)
);

INSERT INTO Products (id, title, description, image, price)
VALUES
(
    '53f3c2a8-ccad-412d-a48b-d04ab5608894',
    'Continuous Delivery',
    'Getting software released to users is often a painful, risky, and time-consuming process. This groundbreaking new book sets out the principles and technical practices that enable rapid, incremental delivery of high quality, valuable new functionality to users.',
    'https://images-na.ssl-images-amazon.com/images/I/51NbiDn81NL._SX385_BO1,204,203,200_.jpg',
    34.59
),
(
    '44b1d668-6dfb-4f89-ac9c-7eab71a902e1',
    'Algorithms',
    'The algorithms in this book represent a body of knowledge developed over the last 50 years that has become indispensable, not just for professional programmers and computer science students but for any student with interests in science, mathematics, and engineering, not to mention students who use computation in the liberal arts.',
    'https://images-na.ssl-images-amazon.com/images/I/41-RWwEls6L._SX400_BO1,204,203,200_.jpg',
    53.99
),
(
    '696946ac-4fc9-4959-b57b-43695a036d8f',
    'The Self-Taught Programmer',
    '“The Self-taught Programmer” is a roadmap, a guide to take you from writing your first Python program, to passing your first technical interview. The path is there. Will you take it?',
    'https://images-na.ssl-images-amazon.com/images/I/31YJmObNTnL._SX404_BO1,204,203,200_.jpg',
    11.99
),
(
    '2aa222ce-0d65-4782-af17-0851e8cc45ac',
    'Rapid Development',
    'Corporate and commercial software-development teams all want solutions for one important problem—how to get their high-pressure development schedules under control. In RAPID DEVELOPMENT, author Steve McConnell addresses that concern head-on with overall strategies, specific best practices, and valuable tips that help shrink and control development schedules and keep projects moving.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f288045f3c86d4331191cfa_22.jpg',
    17.27
),
(
    'bfff119f-84a3-4e68-9f4e-5267b3f03a15',
    'Coders at work',
    'This is a who’s who in the programming world - a fascinating look at how some of the best in the world do their work. Patterned after the best selling Founders at Work, the book represents two years of interviews with some of the top programmers of our times.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f2880b2e1a3455cf773e11a_21.jpg',
    28.10
),
(
    '5d0023c5-7fa9-40b2-97ef-b55ef52ce7f4',
    'Domain-Driven Design',
    'Leading software designers have recognized domain modeling and design as critical topics for at least twenty years, yet surprisingly little has been written about what needs to be done or how to do it. Although it has never been clearly formulated, a philosophy has developed as an undercurrent in the object community, which I call “domain-driven design”.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f2880fe59cedfed5d24eaeb_20.jpg',
    46.08
),
(
    '9687e7be-aba5-46d9-8176-bd74dd86d1cf',
    'The Art of Computer Programming',
    'Countless readers have spoken about the profound personal influence of Knuth’s work. Scientists have marveled at the beauty and elegance of his analysis, while ordinary programmers have successfully applied his “cookbook” solutions to their day-to-day problems. All have admired Knuth for the breadth, clarity, accuracy, and good humor found in his books.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f2881587ef7356642184b0e_19.jpg',
    215.52
),
(
    '63229cfc-2636-4e3e-a8c7-5bb0ba3bc2ed',
    'Structure and Interpretation of Computer Programs',
    'Structure and Interpretation of Computer Programs has had a dramatic impact on computer science curricula over the past decade. This long-awaited revision contains changes throughout the text. There are new implementations of most of the major programming systems in the book, including the interpreters and compilers, and the authors have incorporated many small changes that reflect their experience teaching the course at MIT since the first edition was published.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f2881f5a59aed1c22dca7ac_17.jpg',
    75.75
),
(
    '334e575e-2396-41df-a3af-27875422ce39',
    'Patterns of Enterprise Application Architecture',
    'The practice of enterprise application development has benefited from the emergence of many new enabling technologies. Multi-tiered object-oriented platforms, such as Java and .NET, have become commonplace. These new tools and technologies are capable of building powerful applications, but they are not easily implemented. Common failures in enterprise applications often occur because their developers do not understand the architectural lessons that experienced object developers have learned.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f2882363e3ef359cc768edd_16.jpg',
    45.27
),
(
    '176cf8e9-df90-43ce-9790-16811aaff60c',
    'Programming Pearls',
    'Computer programming has many faces. Fred Brooks paints the big picture in The Mythical Man Month; his essays underscore the crucial role of management in large software projects. At a finer grain, Steve McConnell teaches good programming style in Code Complete. The topics in those books are the key to good software and the hallmark of the professional programmer. Unfortunately, though, the workmanlike application of those sound engineering principles isn’t always thrilling – until the software is completed on time and works without surprise.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f2882877a7de4b1766cae8f_16-bis.jpg',
    24.29
),
(
    '2f03b75d-47de-494e-b6ba-7e7d492cae1a',
    'Peopleware',
    'The unique insight of this longtime bestseller is that the major issues of software development are human, not technical. They’re not easy issues; but solve them, and you’ll maximize your chances of success.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f2882e8a59aed50e3dca94f_15.jpg',
    56.58
),
(
    'a68c7f67-a879-454a-8148-b29f0a12d1af',
    'Introduction to Algorithms',
    'Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and comprehensiveness. The book covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers. Each chapter is relatively self-contained and can be used as a unit of study. The algorithms are described in English and in a pseudocode designed to be readable by anyone who has done a little programming. The explanations have been kept elementary without sacrificing depth of coverage or mathematical rigor.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f2885d27ef735d1ca1852bc_14.jpg',
    62.99
),
(
    '04401744-4178-497b-af63-597b83882507',
    'Code',
    'What do flashlights, the British invasion, black cats, and seesaws have to do with computers? In CODE, they show us the ingenious ways we manipulate language and invent new means of communicating with each other. And through CODE, we see how this ingenuity and our very human compulsion to communicate have driven the technological innovations of the past two centuries.',
    'https://uploads-ssl.webflow.com/5f280c5b57d2edfcbbb057ea/5f288608d6d8555867fddc86_13.jpg',
    24.74
);

INSERT INTO Stocks(product_id, count)
VALUES
(
    '53f3c2a8-ccad-412d-a48b-d04ab5608894',
    24
),
(
    '44b1d668-6dfb-4f89-ac9c-7eab71a902e1',
    43
),
(
    '696946ac-4fc9-4959-b57b-43695a036d8f',
    32
),
(
    '2aa222ce-0d65-4782-af17-0851e8cc45ac',
    54
),
(
    'bfff119f-84a3-4e68-9f4e-5267b3f03a15',
    12
),
(
    '5d0023c5-7fa9-40b2-97ef-b55ef52ce7f4',
    39
),
(
    '9687e7be-aba5-46d9-8176-bd74dd86d1cf',
    64
),
(
    '63229cfc-2636-4e3e-a8c7-5bb0ba3bc2ed',
    54
),
(
    '334e575e-2396-41df-a3af-27875422ce39',
    71
),
(
    '176cf8e9-df90-43ce-9790-16811aaff60c',
    47
),
(
    '2f03b75d-47de-494e-b6ba-7e7d492cae1a',
    35
),
(
    'a68c7f67-a879-454a-8148-b29f0a12d1af',
    92
),
(
    '04401744-4178-497b-af63-597b83882507',
    58
);
