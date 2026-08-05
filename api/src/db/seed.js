import "dotenv/config";
import { db } from "./client.js";
import { movies } from "./schema.js";

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

async function seed() {
  console.log(`Seeding ${seedMovies.length} movies...`);
  const inserted = await db.insert(movies).values(seedMovies).returning();
  console.log(`Inserted ${inserted.length} movies.`);
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit();
  });
