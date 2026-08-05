import "dotenv/config";
import bcrypt from "bcrypt";
import { db } from "./client.js";
import { movies, users, ratings } from "./schema.js";

// Seed catalogue sourced from test/gv.txt
const seedMovies = [
  {
    title: "Dear You 给阿嬷的情书",
    description:
      `Teochew grandma Ye Shurou had always lived a peaceful, quiet life, enjoying her twilight years. Burdened by heavy debts, her grandson Xiaowei left for Thailand without telling the family, searching for his rumored billionaire grandfather, Zheng Musheng. However, Xiaowei ultimately returned with a shocking revelation that rocked the entire family: his grandfather had passed away long ago, and the person who had been exchanging romantic letters with Grandma all these years was actually a complete stranger. As Xiaowei dug deeper, a hidden, half-century-old love story suddenly came to light, striking deep into Grandma's heart.
潮汕阿嬷叶淑柔一直守着平淡的日子，安享晚年。孙子晓伟因债务缠身，瞒着家人远赴泰国，寻找传闻中的亿万富豪阿公郑木生。然而，晓伟最后却带回了一个震惊整个家族的消息：阿公早已不在人世，那个与阿嬷一直在书信中谈情说爱的，竟是一个陌生人。随着晓伟的调查，一段隐藏了半世纪的感情赫然袭来，击中了阿嬷的心。`,
    genre: "Drama",
    releaseDate: "2026-06-18",
    posterUrl: "https://media.gv.com.sg/imagesresize/img4473.jpg",
  },
  {
    title: "Blades Of The Guardians 镖人: 风起大漠",
    description:
      `Four generations of martial arts stars unite! Directed by Yuen Woo Ping, icons like Wu Jing, Nicholas Tse, and Jet Li come together for an epic martial arts event. In the desert, many groups — including escorts, the government, and merchants — are fighting for power. Dao Ma, a famous biao ren, takes on the job of protecting a man on the long road to the city of Chang’an. However, he discovers the person he is protecting is the empire's most wanted man, Zhi Shi Lang. Every greedy faction is now hunting them and a deadly battle for the prize begins…
四代武侠人齐聚，唤醒三代人的共同记忆！“天下第一武指”袁和平执导，吴京、谢霆锋、李连杰等动作演员重磅集结。武侠界半壁江山，共赴久违的武林盛宴！ 大漠之上，镖人、官府、胡商多方势力盘根错节、暗潮涌动。“天字第二号逃犯”刀马接下特殊押镖任务，和同伴一起从西域护镖远赴长安。不料，他们的护送对象竟是“天字第一号逃犯”知世郎……天下熙熙皆为利来，各方势力闻风入局，抢镖厮杀接连上演……`,
    genre: "Action",
    releaseDate: "2026-02-17",
    posterUrl: "https://media.gv.com.sg/imagesresize/img4435.jpg",
  },
  {
    title: "Spider-Man: Across The Spider-Verse",
    description:
      `Miles Morales returns for the next chapter of the Oscar®-winning Spider-Verse saga, Spider-Man: Across the Spider-Verse. After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders and must redefine what it means to be a hero so he can save the people he loves most.`,
    genre: "Action/ Adventure/ Animation",
    releaseDate: "2023-06-01",
    posterUrl: "https://media.gv.com.sg/imagesresize/img4376.jpg",
  },
  {
    title: "Minions & Monsters",
    description:
      `Fresh off the worldwide blockbuster success of summer 2024’s funniest comedy, Despicable Me 4, Illumination expands its joyful animated universe with a riotous new chapter, featuring all-new characters, in the biggest global animated franchise in history: Minions & Monsters. This is the rambunctious, ridiculous and totally true story of how the Minions conquered Hollywood, became movie stars, lost everything, unleashed monsters onto the world and then banded together to try and save the planet from the mayhem they had just created.`,
    genre: "Animation",
    releaseDate: "2026-07-01",
    posterUrl: "https://media.gv.com.sg/imagesresize/img1398.jpg",
  },
  {
    title: "The Super Mario Galaxy Movie",
    description:
      `The Super Mario Galaxy Movie is an animated film based on the world of Super Mario Bros., and follows The Super Mario Bros. Movie, which was released in 2023 and earned more than $1.3 billion worldwide. Both the 2023 film and The Super Mario Galaxy Movie are produced by Chris Meledandri of Illumination and Shigeru Miyamoto of Nintendo.
The film will be co-financed by Universal Pictures and Nintendo and will be released worldwide by Universal Pictures.
The Super Mario Galaxy Movie is directed by returning filmmakers Aaron Horvath and Michael Jelenic, from a screenplay by returning screenwriter Matthew Fogel, with Brian Tyler returning to compose the score.`,
    genre: "Animation",
    releaseDate: "2026-04-01",
    posterUrl: "https://media.gv.com.sg/imagesresize/img1362.jpg",
  },
  {
    title: "Dog Man",
    description:
      `Dog Man, half dog and half man, he is sworn to protect and serve as he doggedly pursues the feline supervillain Petey the Cat.`,
    genre: "Animation",
    releaseDate: "2025-03-13",
    posterUrl: "https://media.gv.com.sg/imagesresize/img1271.jpg",
  },
  {
    title: "F1 The Movie",
    description:
      `The highly anticipated Formula 1® racing feature stars Brad Pitt as a former driver who returns to Formula 1®, alongside Damson Idris as his teammate at APXGP, a fictional team on the grid. The feature has been shot during actual Grand Prix weekends as the team competes against the titans of the sport.`,
    genre: "Action/ Sports",
    releaseDate: "2025-06-26",
    posterUrl: "https://media.gv.com.sg/imagesresize/img1242.jpg",
  },
  {
    title: "La La Land",
    description:
      `Written and directed by Academy Award® nominee Damien Chazelle, LA LA LAND tells the story of Mia (Emma Stone), an aspiring actress, and Sebastian (Ryan Gosling), a dedicated jazz musician, who are struggling to make ends meet in a city known for crushing hopes and breaking hearts. Set in modern-day Los Angeles, this original musical about everyday life explores the joy and pain of pursuing your dreams.`,
    genre: "Romance",
    releaseDate: "2016-12-08",
    posterUrl: "https://www.gv.com.sg/media/imagesresize/img5853.jpg",
  },
];

// Seed users — all share the password "password123"
const seedUsers = [
  {
    name: "Admin User",
    email: "admin@moviesapp.com",
    role: "admin",
  },
  {
    name: "Haiyun",
    email: "haiyun@example.com",
    role: "user",
  },
  {
    name: "Alice Tan",
    email: "alice.tan@example.com",
    role: "user",
  },
  {
    name: "Benjamin Koh",
    email: "benjamin.koh@example.com",
    role: "user",
  },
  {
    name: "Chloe Lim",
    email: "chloe.lim@example.com",
    role: "user",
  },
  {
    name: "Daniel Wong",
    email: "daniel.wong@example.com",
    role: "user",
  },
];

// Ratings/reviews are matched up to seeded movies and users by index below.
const seedRatingsData = [
  {
    userEmail: "alice.tan@example.com",
    movieTitle: "Dear You 给阿嬷的情书",
    value: 5,
    review:
      "A heartfelt tribute to family and memory. The reveal about the letters had me in tears — beautifully acted.",
  },
  {
    userEmail: "benjamin.koh@example.com",
    movieTitle: "Dear You 给阿嬷的情书",
    value: 4,
    review:
      "Touching family drama with a strong emotional core, though the pacing dragged a little in the middle.",
  },
  {
    userEmail: "chloe.lim@example.com",
    movieTitle: "Blades Of The Guardians 镖人: 风起大漠",
    value: 4,
    review:
      "Solid martial arts spectacle — the desert cinematography and fight choreography are top notch.",
  },
  {
    userEmail: "daniel.wong@example.com",
    movieTitle: "Blades Of The Guardians 镖人: 风起大漠",
    value: 3,
    review: "Fun action but the plot felt a bit thin given the star power involved.",
  },
  {
    userEmail: "alice.tan@example.com",
    movieTitle: "Spider-Man: Across The Spider-Verse",
    value: 5,
    review: "Visually stunning and emotionally gripping. Miles Morales' journey keeps getting better.",
  },
  {
    userEmail: "benjamin.koh@example.com",
    movieTitle: "Spider-Man: Across The Spider-Verse",
    value: 5,
    review: "One of the best animated superhero films ever made. The multiverse concept is executed brilliantly.",
  },
  {
    userEmail: "chloe.lim@example.com",
    movieTitle: "Minions & Monsters",
    value: 3,
    review: "Silly and fun for the kids, but not as memorable as the earlier films in the franchise.",
  },
  {
    userEmail: "daniel.wong@example.com",
    movieTitle: "The Super Mario Galaxy Movie",
    value: 4,
    review: "A colorful, nostalgic romp through the Mario universe — great for fans of the games.",
  },
  {
    userEmail: "alice.tan@example.com",
    movieTitle: "Dog Man",
    value: 3,
    review: "Cute and goofy, my kids loved it even if the story is fairly predictable.",
  },
  {
    userEmail: "benjamin.koh@example.com",
    movieTitle: "F1 The Movie",
    value: 5,
    review: "Adrenaline-pumping racing sequences shot right on real Grand Prix weekends — thrilling from start to finish.",
  },
  {
    userEmail: "chloe.lim@example.com",
    movieTitle: "La La Land",
    value: 5,
    review: "A gorgeous musical love letter to dreamers. Gosling and Stone have incredible chemistry.",
  },
  {
    userEmail: "daniel.wong@example.com",
    movieTitle: "La La Land",
    value: 4,
    review: "Beautifully shot with unforgettable music, though the ending is bittersweet.",
  },
];

async function seed() {
  console.log("Clearing existing ratings, movies, and users...");
  await db.delete(ratings);
  await db.delete(movies);
  await db.delete(users);

  console.log(`Seeding ${seedMovies.length} movies...`);
  const insertedMovies = await db.insert(movies).values(seedMovies).returning();
  console.log(`Inserted ${insertedMovies.length} movies.`);

  console.log(`Seeding ${seedUsers.length} users...`);
  const passwordHash = await bcrypt.hash("password123", 10);
  const insertedUsers = await db
    .insert(users)
    .values(seedUsers.map((user) => ({ ...user, passwordHash })))
    .returning();
  console.log(`Inserted ${insertedUsers.length} users.`);

  const movieIdByTitle = new Map(insertedMovies.map((m) => [m.title, m.id]));
  const userIdByEmail = new Map(insertedUsers.map((u) => [u.email, u.id]));

  const seedRatings = seedRatingsData.map(({ userEmail, movieTitle, value, review }) => ({
    userId: userIdByEmail.get(userEmail),
    movieId: movieIdByTitle.get(movieTitle),
    value,
    review,
  }));

  console.log(`Seeding ${seedRatings.length} ratings/reviews...`);
  const insertedRatings = await db.insert(ratings).values(seedRatings).returning();
  console.log(`Inserted ${insertedRatings.length} ratings/reviews.`);
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit();
  });
