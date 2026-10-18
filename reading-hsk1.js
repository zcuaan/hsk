/* Original HSK 1 reading comprehension bank for gogochinago.
 * Chinese text validated against the current HSK 3.0 Level 1 300-word syllabus.
 * 20 questions per difficulty (beginner, developing, challenge).
 */
(function(){
 'use strict';
 const questions=[
  {
    "id": "hsk1-r001",
    "stage": 1,
    "hanzi": "我喜欢喝茶。",
    "answer": "I like drinking tea.",
    "wrong": [
      "I don't like drinking tea.",
      "I want to buy tea.",
      "My father likes tea."
    ],
    "note": "喜欢 means like; 喝 means drink."
  },
  {
    "id": "hsk1-r002",
    "stage": 1,
    "hanzi": "他是老师。",
    "answer": "He is a teacher.",
    "wrong": [
      "He is a student.",
      "She is a teacher.",
      "He likes the teacher."
    ],
    "note": "是 connects a person to their identity or role."
  },
  {
    "id": "hsk1-r003",
    "stage": 1,
    "hanzi": "这是我的书。",
    "answer": "This is my book.",
    "wrong": [
      "That is my book.",
      "This is my phone.",
      "This book is new."
    ],
    "note": "我的 means my; 这 means this."
  },
  {
    "id": "hsk1-r004",
    "stage": 1,
    "hanzi": "她没有手机。",
    "answer": "She doesn't have a mobile phone.",
    "wrong": [
      "She has a mobile phone.",
      "She doesn't have a computer.",
      "He doesn't have a mobile phone."
    ],
    "note": "没有 means do not have."
  },
  {
    "id": "hsk1-r005",
    "stage": 1,
    "hanzi": "我们去学校。",
    "answer": "We are going to school.",
    "wrong": [
      "We are leaving school.",
      "We are going to hospital.",
      "They are going to school."
    ],
    "note": "我们 means we; 去 means go to."
  },
  {
    "id": "hsk1-r006",
    "stage": 1,
    "hanzi": "今天很热。",
    "answer": "It is very hot today.",
    "wrong": [
      "It is very cold today.",
      "It will be hot tomorrow.",
      "It was hot yesterday."
    ],
    "note": "今天 means today; 热 means hot."
  },
  {
    "id": "hsk1-r007",
    "stage": 1,
    "hanzi": "我妈妈喜欢苹果。",
    "answer": "My mum likes apples.",
    "wrong": [
      "My mum is buying apples.",
      "My dad likes apples.",
      "My mum likes tea."
    ],
    "note": "妈妈 is mum; 苹果 means apples."
  },
  {
    "id": "hsk1-r008",
    "stage": 1,
    "hanzi": "你喝水吗？",
    "answer": "Do you drink water?",
    "wrong": [
      "Are you buying water?",
      "Do you like tea?",
      "I want to drink water."
    ],
    "note": "吗 changes a statement into a yes-or-no question."
  },
  {
    "id": "hsk1-r009",
    "stage": 1,
    "hanzi": "我有两个哥哥。",
    "answer": "I have two older brothers.",
    "wrong": [
      "I have two younger brothers.",
      "I have one older brother.",
      "She has two older brothers."
    ],
    "note": "哥哥 means older brother; 两个 means two."
  },
  {
    "id": "hsk1-r010",
    "stage": 1,
    "hanzi": "我爸爸在公司工作。",
    "answer": "My dad works at a company.",
    "wrong": [
      "My dad studies at school.",
      "My mum works at a company.",
      "My dad is going to a company."
    ],
    "note": "在 indicates the location; 工作 means work."
  },
  {
    "id": "hsk1-r011",
    "stage": 1,
    "hanzi": "明天是星期日。",
    "answer": "Tomorrow is Sunday.",
    "wrong": [
      "Today is Sunday.",
      "Tomorrow is Saturday.",
      "Yesterday was Sunday."
    ],
    "note": "明天 means tomorrow; 星期日 means Sunday."
  },
  {
    "id": "hsk1-r012",
    "stage": 1,
    "hanzi": "这件衣服很贵。",
    "answer": "This item of clothing is expensive.",
    "wrong": [
      "This item of clothing is cheap.",
      "This item of clothing is new.",
      "These clothes are expensive."
    ],
    "note": "件 is used to count clothing; 贵 means expensive."
  },
  {
    "id": "hsk1-r013",
    "stage": 1,
    "hanzi": "她会说汉语。",
    "answer": "She can speak Chinese.",
    "wrong": [
      "She likes reading Chinese.",
      "She cannot speak Chinese.",
      "He can speak Chinese."
    ],
    "note": "会 can express an ability learned through practice."
  },
  {
    "id": "hsk1-r014",
    "stage": 1,
    "hanzi": "我们住在中国。",
    "answer": "We live in China.",
    "wrong": [
      "We are going to China.",
      "We study Chinese.",
      "They live in China."
    ],
    "note": "住在 means live in or live at."
  },
  {
    "id": "hsk1-r015",
    "stage": 1,
    "hanzi": "他不喜欢猫。",
    "answer": "He doesn't like cats.",
    "wrong": [
      "He likes cats.",
      "He doesn't like dogs.",
      "She doesn't like cats."
    ],
    "note": "不 negates 喜欢, meaning like."
  },
  {
    "id": "hsk1-r016",
    "stage": 1,
    "hanzi": "我今天不上班。",
    "answer": "I'm not working today.",
    "wrong": [
      "I'm going to work today.",
      "I'm not going to school today.",
      "I'm working tomorrow."
    ],
    "note": "上班 means go to work; 不 makes it negative."
  },
  {
    "id": "hsk1-r017",
    "stage": 1,
    "hanzi": "这是我的女朋友。",
    "answer": "This is my girlfriend.",
    "wrong": [
      "That is my girlfriend.",
      "This is my daughter.",
      "This is my classmate."
    ],
    "note": "女朋友 means girlfriend."
  },
  {
    "id": "hsk1-r018",
    "stage": 1,
    "hanzi": "你叫什么名字？",
    "answer": "What is your name?",
    "wrong": [
      "What is his name?",
      "Where do you live?",
      "How old are you?"
    ],
    "note": "叫什么名字 asks what someone is called."
  },
  {
    "id": "hsk1-r019",
    "stage": 1,
    "hanzi": "请喝一点儿水。",
    "answer": "Please drink a little water.",
    "wrong": [
      "Please buy some water.",
      "Please don't drink water.",
      "Please drink a little milk."
    ],
    "note": "请 is polite; 一点儿 means a little."
  },
  {
    "id": "hsk1-r020",
    "stage": 1,
    "hanzi": "我的狗在家里。",
    "answer": "My dog is at home.",
    "wrong": [
      "My cat is at home.",
      "My dog is outside.",
      "My dog is at school."
    ],
    "note": "在家里 means at home."
  },
  {
    "id": "hsk1-r021",
    "stage": 2,
    "hanzi": "我下午三点上课。",
    "answer": "I have class at three in the afternoon.",
    "wrong": [
      "My class finishes at three in the afternoon.",
      "I have class at three in the morning.",
      "I go to work at three in the afternoon."
    ],
    "note": "下午 is afternoon; 上课 means have class."
  },
  {
    "id": "hsk1-r022",
    "stage": 2,
    "hanzi": "她想买一件新衣服。",
    "answer": "She wants to buy a new item of clothing.",
    "wrong": [
      "She wants to sell some clothes.",
      "She is wearing new clothes.",
      "She wants to buy a new phone."
    ],
    "note": "想买 means want to buy; 新 means new."
  },
  {
    "id": "hsk1-r023",
    "stage": 2,
    "hanzi": "我觉得这个饭店很好。",
    "answer": "I think this restaurant is good.",
    "wrong": [
      "I think this restaurant is expensive.",
      "He thinks this restaurant is good.",
      "I think this hotel is very small."
    ],
    "note": "觉得 introduces someone's opinion."
  },
  {
    "id": "hsk1-r024",
    "stage": 2,
    "hanzi": "他正在看电影。",
    "answer": "He is watching a film right now.",
    "wrong": [
      "He wants to watch a film.",
      "He has finished watching a film.",
      "He is watching television."
    ],
    "note": "正在 indicates an action happening now."
  },
  {
    "id": "hsk1-r025",
    "stage": 2,
    "hanzi": "你们什么时候下课？",
    "answer": "When do your classes finish?",
    "wrong": [
      "When do your classes begin?",
      "Where is your school?",
      "When do you go to work?"
    ],
    "note": "什么时候 means when; 下课 means finish class."
  },
  {
    "id": "hsk1-r026",
    "stage": 2,
    "hanzi": "我哥哥今年二十岁。",
    "answer": "My older brother is twenty years old this year.",
    "wrong": [
      "My older brother is twelve years old.",
      "My younger brother is twenty years old.",
      "My older brother will be twenty next year."
    ],
    "note": "今年 means this year; 岁 marks age."
  },
  {
    "id": "hsk1-r027",
    "stage": 2,
    "hanzi": "今天下雨，我们不去玩。",
    "answer": "It's raining today, so we aren't going out to play.",
    "wrong": [
      "It's raining tomorrow, so we aren't going out to play.",
      "It's raining today, but we're going to play.",
      "It's raining today, so we're going to work."
    ],
    "note": "下雨 means rain; 不去玩 means not going out to play."
  },
  {
    "id": "hsk1-r028",
    "stage": 2,
    "hanzi": "这本书是你的吗？",
    "answer": "Is this book yours?",
    "wrong": [
      "Is this book new?",
      "Is that your phone?",
      "Is this book mine?"
    ],
    "note": "你的 means yours here; 吗 indicates a question."
  },
  {
    "id": "hsk1-r029",
    "stage": 2,
    "hanzi": "我们去超市买水果。",
    "answer": "We're going to the supermarket to buy fruit.",
    "wrong": [
      "We're going to the supermarket to sell fruit.",
      "We're going to the shop to buy clothes.",
      "They're going to the supermarket to buy fruit."
    ],
    "note": "去…买… means go somewhere to buy something."
  },
  {
    "id": "hsk1-r030",
    "stage": 2,
    "hanzi": "我弟弟不喜欢吃饺子。",
    "answer": "My younger brother doesn't like eating dumplings.",
    "wrong": [
      "My older brother doesn't like eating dumplings.",
      "My younger brother likes eating dumplings.",
      "My younger brother doesn't like eating noodles."
    ],
    "note": "弟弟 is younger brother; 饺子 means dumplings."
  },
  {
    "id": "hsk1-r031",
    "stage": 2,
    "hanzi": "今天很冷，昨天很热。",
    "answer": "Today is cold, but yesterday was hot.",
    "wrong": [
      "Today is hot, but yesterday was cold.",
      "Today and yesterday were both cold.",
      "Tomorrow will be cold and today is hot."
    ],
    "note": "今天 is today; 昨天 is yesterday."
  },
  {
    "id": "hsk1-r032",
    "stage": 2,
    "hanzi": "我的朋友会开车，我不会。",
    "answer": "My friend can drive, but I can't.",
    "wrong": [
      "I can drive, but my friend can't.",
      "My friend and I can both drive.",
      "My friend can drive, and I'm learning too."
    ],
    "note": "会开车 means can drive; 不会 means cannot."
  },
  {
    "id": "hsk1-r033",
    "stage": 2,
    "hanzi": "她想问老师一个问题。",
    "answer": "She wants to ask the teacher a question.",
    "wrong": [
      "The teacher wants to ask her a question.",
      "She wants to ask a student a question.",
      "She wants to answer the teacher's question."
    ],
    "note": "问 means ask; 问题 means question."
  },
  {
    "id": "hsk1-r034",
    "stage": 2,
    "hanzi": "我在学校看见了他。",
    "answer": "I saw him at school.",
    "wrong": [
      "He saw me at school.",
      "I saw him at home.",
      "I will see him at school tomorrow."
    ],
    "note": "了 marks the completed event here."
  },
  {
    "id": "hsk1-r035",
    "stage": 2,
    "hanzi": "我觉得这个电影很好看。",
    "answer": "I think this film is really good.",
    "wrong": [
      "I think this film is really boring.",
      "He thinks this film is really good.",
      "I think this television is very nice."
    ],
    "note": "好看 can mean enjoyable to watch."
  },
  {
    "id": "hsk1-r036",
    "stage": 2,
    "hanzi": "我们上午十点去医院。",
    "answer": "We're going to the hospital at ten in the morning.",
    "wrong": [
      "We're going to the hospital at ten at night.",
      "We're going to school at ten in the morning.",
      "We're leaving the hospital at ten in the morning."
    ],
    "note": "上午 means morning; 去医院 means go to hospital."
  },
  {
    "id": "hsk1-r037",
    "stage": 2,
    "hanzi": "你的手机在哪里？",
    "answer": "Where is your mobile phone?",
    "wrong": [
      "Where is my mobile phone?",
      "What is on your mobile phone?",
      "Are you buying a mobile phone?"
    ],
    "note": "哪里 asks where; 在 indicates location."
  },
  {
    "id": "hsk1-r038",
    "stage": 2,
    "hanzi": "这个苹果多少钱？",
    "answer": "How much does this apple cost?",
    "wrong": [
      "How many apples are there?",
      "Is this apple cheap?",
      "Where can I buy this apple?"
    ],
    "note": "多少钱 asks how much something costs."
  },
  {
    "id": "hsk1-r039",
    "stage": 2,
    "hanzi": "她今天有点儿忙。",
    "answer": "She's a little busy today.",
    "wrong": [
      "She's very busy tomorrow.",
      "She isn't busy today.",
      "She's a little cold today."
    ],
    "note": "有点儿 before an adjective means a bit."
  },
  {
    "id": "hsk1-r040",
    "stage": 2,
    "hanzi": "这些书是我姐姐的。",
    "answer": "These books belong to my older sister.",
    "wrong": [
      "These books belong to my younger sister.",
      "This book belongs to my older sister.",
      "These books belong to my mother."
    ],
    "note": "这些 means these; 姐姐 means older sister."
  },
  {
    "id": "hsk1-r041",
    "stage": 3,
    "hanzi": "今天晚上我想和朋友去电影院看电影。",
    "answer": "I want to go to the cinema with a friend tonight.",
    "wrong": [
      "I want to go to the cinema alone tonight.",
      "I want to go to the cinema with a friend this afternoon.",
      "I want to watch a film at home with a friend tonight."
    ],
    "note": "和朋友 means with a friend; 今天晚上 means tonight."
  },
  {
    "id": "hsk1-r042",
    "stage": 3,
    "hanzi": "妈妈正在做饭，爸爸在看电视。",
    "answer": "Mum is cooking, and dad is watching TV.",
    "wrong": [
      "Mum is watching TV, and dad is cooking.",
      "Mum and dad are both cooking.",
      "Mum and dad are both watching TV."
    ],
    "note": "正在 signals a current action."
  },
  {
    "id": "hsk1-r043",
    "stage": 3,
    "hanzi": "我昨天没有去学校，我生病了。",
    "answer": "I didn't go to school yesterday because I was ill.",
    "wrong": [
      "I didn't go to work yesterday because I was ill.",
      "I went to school yesterday even though I was ill.",
      "I won't go to school tomorrow because I'm ill."
    ],
    "note": "没有去 means did not go; 生病了 means became ill."
  },
  {
    "id": "hsk1-r044",
    "stage": 3,
    "hanzi": "我们下午三点下课，四点回家。",
    "answer": "Our classes finish at three and we go home at four in the afternoon.",
    "wrong": [
      "Our classes finish at four and we go home at three.",
      "We go to class at three and finish at four.",
      "We finish work at three and go home at four."
    ],
    "note": "下课 means finish class; 回家 means go home."
  },
  {
    "id": "hsk1-r045",
    "stage": 3,
    "hanzi": "他想买那件衣服，他没有钱。",
    "answer": "He wants to buy that item of clothing, but he doesn't have money.",
    "wrong": [
      "He wants to sell that item of clothing because he needs money.",
      "He wants to buy this item of clothing, and he has money.",
      "He doesn't want the clothing because it's expensive."
    ],
    "note": "那件 means that item; 没有钱 means have no money."
  },
  {
    "id": "hsk1-r046",
    "stage": 3,
    "hanzi": "我觉得学汉字很好玩儿。",
    "answer": "I think learning Chinese characters is fun.",
    "wrong": [
      "I think speaking Chinese is very difficult.",
      "I don't like learning Chinese characters.",
      "I think Chinese characters are expensive."
    ],
    "note": "学 means study; 汉字 means Chinese characters."
  },
  {
    "id": "hsk1-r047",
    "stage": 3,
    "hanzi": "老师问我一个问题，我不知道。",
    "answer": "The teacher asks me a question, and I don't know the answer.",
    "wrong": [
      "I ask the teacher a question, and they don't know the answer.",
      "The teacher asks me a question, and I know the answer.",
      "A student asks me a question, and I don't know the answer."
    ],
    "note": "问 means ask; 不知道 means don't know."
  },
  {
    "id": "hsk1-r048",
    "stage": 3,
    "hanzi": "你想喝茶吗？我想喝牛奶。",
    "answer": "Do you want tea? I want milk.",
    "wrong": [
      "Do you want milk? I want tea.",
      "Do you want tea? I want tea too.",
      "Do you want water? I want milk."
    ],
    "note": "The question asks about 茶; the reply chooses 牛奶."
  },
  {
    "id": "hsk1-r049",
    "stage": 3,
    "hanzi": "这个饭店的面条儿很好吃，也不贵。",
    "answer": "The noodles at this restaurant are tasty and not expensive.",
    "wrong": [
      "The noodles at this restaurant are tasty but expensive.",
      "The dumplings at this restaurant are tasty and cheap.",
      "The noodles at this restaurant aren't tasty but are cheap."
    ],
    "note": "好吃 means tasty; 也不贵 means also not expensive."
  },
  {
    "id": "hsk1-r050",
    "stage": 3,
    "hanzi": "她有两个孩子，一个儿子，一个女儿。",
    "answer": "She has two children: one son and one daughter.",
    "wrong": [
      "She has two sons and one daughter.",
      "She has one child, a daughter.",
      "She has two daughters."
    ],
    "note": "儿子 means son; 女儿 means daughter."
  },
  {
    "id": "hsk1-r051",
    "stage": 3,
    "hanzi": "我早上七点起床，晚上十点睡觉。",
    "answer": "I get up at seven in the morning and go to sleep at ten at night.",
    "wrong": [
      "I get up at ten in the morning and go to sleep at seven at night.",
      "I get up at seven at night and go to sleep at ten in the morning.",
      "I get up at seven in the morning and go to sleep at nine at night."
    ],
    "note": "起床 means get up; 睡觉 means sleep."
  },
  {
    "id": "hsk1-r052",
    "stage": 3,
    "hanzi": "你在做什么？我在写汉字。",
    "answer": "What are you doing? I'm writing Chinese characters.",
    "wrong": [
      "What are you reading? I'm reading Chinese characters.",
      "What are you doing? I'm studying Chinese at school.",
      "What are you writing? I'm writing English."
    ],
    "note": "在…做 describes an ongoing activity; 写 means write."
  },
  {
    "id": "hsk1-r053",
    "stage": 3,
    "hanzi": "我知道那家书店在哪里。",
    "answer": "I know where that bookshop is.",
    "wrong": [
      "I don't know where that bookshop is.",
      "I know where this supermarket is.",
      "I want to go to that bookshop."
    ],
    "note": "知道 means know; 哪里 means where."
  },
  {
    "id": "hsk1-r054",
    "stage": 3,
    "hanzi": "我的老师不是中国人，她会说中文。",
    "answer": "My teacher isn't Chinese, but she can speak Chinese.",
    "wrong": [
      "My teacher is Chinese, but she can't speak Chinese.",
      "My teacher isn't Chinese and can't speak Chinese.",
      "My teacher is Chinese and speaks Chinese."
    ],
    "note": "不是 means is not; 会说 means can speak."
  },
  {
    "id": "hsk1-r055",
    "stage": 3,
    "hanzi": "我明年想去中国学习汉语。",
    "answer": "I want to go to China next year to study Chinese.",
    "wrong": [
      "I went to China last year to study Chinese.",
      "I want to go to China this year to work.",
      "I want to stay in China next year to teach."
    ],
    "note": "明年 means next year; 学习汉语 means study Chinese."
  },
  {
    "id": "hsk1-r056",
    "stage": 3,
    "hanzi": "我家有三个人，还有一只猫。",
    "answer": "There are three people in my family, and we also have a cat.",
    "wrong": [
      "There are three people in my family, and we also have a dog.",
      "There are four people in my family and a cat.",
      "There are three cats and one person in my family."
    ],
    "note": "还有 means also have; 只 counts animals."
  },
  {
    "id": "hsk1-r057",
    "stage": 3,
    "hanzi": "电影院在饭店前边。",
    "answer": "The cinema is in front of the restaurant.",
    "wrong": [
      "The restaurant is in front of the cinema.",
      "The cinema is behind the restaurant.",
      "The cinema is inside the restaurant."
    ],
    "note": "前边 means in front of; 在 describes location."
  },
  {
    "id": "hsk1-r058",
    "stage": 3,
    "hanzi": "今天下雨，明天也下雨。",
    "answer": "It's raining today, and it will rain tomorrow too.",
    "wrong": [
      "It rained yesterday, and it's raining today too.",
      "It's raining today, but tomorrow will be sunny.",
      "It isn't raining today, but it will rain tomorrow."
    ],
    "note": "也 means also or too."
  },
  {
    "id": "hsk1-r059",
    "stage": 3,
    "hanzi": "这家商店的苹果很便宜，那家很贵。",
    "answer": "Apples at this shop are cheap, while the other shop is expensive.",
    "wrong": [
      "Apples at this shop are expensive, while the other shop is cheap.",
      "Both shops sell expensive apples.",
      "Apples at this shop are cheap, and the other shop is also cheap."
    ],
    "note": "这家 means this shop; 那家 means that shop."
  },
  {
    "id": "hsk1-r060",
    "stage": 3,
    "hanzi": "我们是大学生，上午上课，下午工作。",
    "answer": "We're university students: we have class in the morning and work in the afternoon.",
    "wrong": [
      "We're schoolchildren: we work in the morning and have class in the afternoon.",
      "We're university students: we work in the morning and have class in the afternoon.",
      "We're teachers: we have class all day."
    ],
    "note": "大学生 means university student; 上午 and 下午 mark morning and afternoon."
  }
];
 window.HSK_READING_1=Object.freeze(questions.map(q=>Object.freeze(q)));
})();
