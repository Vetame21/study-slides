"""Mock midterm A (期中考试 A 模拟试卷). Source: Exam compre.pdf (5 pages, no answer key).

Most questions also appear in the lesson exercises, so their answers are the teacher's from there.
Answers written for this site are marked [ADDED] in the source.
"""
from cclib import F, O, Q

CHAPTER = {"en": "期中模拟试卷 A (Mock midterm A)", "id": "期中模拟试卷 A (Simulasi UTS A)"}

QUIZ_NOTE = {
    "en": "[NOTE] The mock paper has 8 parts and no answer key. Most answers come from the same questions in the teacher's exercises; answers marked [ADDED] were written for this site. Part 五 and two reading questions are open: compare your answer with the sample, they aren't scored.",
    "id": "[NOTE] Simulasi ini punya 8 bagian dan tanpa kunci jawaban. Kebanyakan jawaban diambil dari soal yang sama di latihan guru; jawaban bertanda [ADDED] dibuat untuk situs ini. Bagian 五 dan dua soal bacaan bersifat terbuka: bandingkan jawabanmu dengan contohnya, tidak dinilai.",
}

BANK2 = "A.暖和 B.好 C.难过 D.打算 E.从来 F.操场 G.疼 H.考 I.预报 J.环境 K.附近 L.方便"
BANK4 = "懂、完、见、错、上、开、成、熟、到"


def P1(n, sentence, answers):
    hint = ("", "") if len(answers) == 1 else (f" ({len(answers)} blanks)", f" ({len(answers)} titik)")
    return F(f"一、看拼音写汉字 · {n}", (f"Write the 汉字{hint[0]}: {sentence}", f"Tulis 汉字{hint[1]}: {sentence}"),
             ["".join(answers)], (" / ".join(answers), " / ".join(answers)))


def P2(n, sentence, word, letter):
    return F(f"二、选词填空 · {n}", (f"{sentence}\n({BANK2})", f"{sentence}\n({BANK2})"), [word, letter],
             (f"{letter}. {word}", f"{letter}. {word}"))


def P3(n, sentence, answers, why):
    hint = ("", "") if len(answers) == 1 else (f" ({len(answers)} blanks)", f" ({len(answers)} titik)")
    return F(f"三、就/再/又/才 · {n}", (f"Fill in 就, 再, 又 or 才{hint[0]}: {sentence}", f"Isi 就, 再, 又, atau 才{hint[1]}: {sentence}"),
             ["".join(answers)], why)


def P4(n, sentence, answers):
    hint = ("", "") if len(answers) == 1 else (f" ({len(answers)} blanks)", f" ({len(answers)} titik)")
    return F(f"四、选词填空 · {n}", (f"{sentence}{hint[0]}\n({BANK4})", f"{sentence}{hint[1]}\n({BANK4})"),
             ["".join(answers)], (" / ".join(answers), " / ".join(answers)))


def P7(n, wrong, right, why):
    return F(f"七、改错句 · {n}", (f"Correct the sentence: {wrong}", f"Perbaiki kalimat: {wrong}"), right, why)


QUIZ = [
    # 一、看拼音写汉字 (answers: review PPT p. 3, 25, 48, 79, 110)
    P1(1, "昨天足球____（bǐ sài），我们____（duì）____（shū）了。", ["比赛", "队", "输"]),
    P1(2, "不是肠____（yán），只是____（xiāo）化不太好。", ["炎", "消"]),
    P1(3, "食堂里的____（cài）太油腻。", ["菜"]),
    P1(4, "公园____（zhōuwéi）有很多树。", ["周围"]),
    P1(5, "这篇课文我____（niàn）得不____（shú）。", ["念", "熟"]),
    P1(6, "这个药的____（xiàoguǒ）很不错。", ["效果"]),
    # 二、选词填空 (answers: lesson 3 p. 52, lesson 5 p. 44, lesson 6 p. 40, lesson 2 p. 54)
    P2(1, "我____不喝酒。", "从来", "E"),
    P2(2, "玛丽在____打太极拳呢。", "操场", "F"),
    P2(3, "这儿周围的____很好。", "环境", "J"),
    P2(4, "我们住的地方有地铁站，交通很____。", "方便", "L"),
    P2(5, "天气____说得不一定对。", "预报", "I"),
    P2(6, "我们国家的冬天比这儿____。", "暖和", "A"),
    P2(7, "我____毕业以后去中国留学。", "打算", "D"),
    P2(8, "学校____有邮局、银行、商店、公园和体育馆。", "附近", "K"),
    P2(9, "我的肚子____得很厉害。", "疼", "G"),
    P2(10, "这次我没考____，因为考试前我病了。", "好", "B"),
    P2(11, "别____了，我们一起去跳跳舞吧。", "难过", "C"),
    P2(12, "很多留学生都想____HSK。", "考", "H"),
    # 三、就/再/又/才 (answers: lesson 3 p. 62, lesson 6 p. 81, lesson 5 p. 79–80)
    P3(1, "我觉得听力很难，同学们听一遍____懂了，我听两三遍____能懂。", ["就", "才"],
       ("就 / 才: once is easy, two or three times is hard.", "就 / 才: sekali sudah paham itu mudah, dua-tiga kali baru paham itu sulit.")),
    P3(2, "八点上课，他八点半____来。", ["才"], ("才: late.", "才: terlambat.")),
    P3(3, "电影七点半开演呢，你怎么现在____来了？", ["就"], ("就: earlier than needed.", "就: lebih awal dari perlu.")),
    P3(4, "昨天已经去过公园了，今天不想____去。", ["再"], ("再: the repeat hasn't happened.", "再: pengulangannya belum terjadi.")),
    P3(5, "老师____说了一遍，我____听懂。", ["又", "才"], ("又 / 才: said again, and only then understood.", "又 / 才: diulang lagi, baru paham.")),
    P3(6, "上星期我已经买了一本，今天我____买了一本。", ["又"], ("又: the repeat already happened.", "又: pengulangannya sudah terjadi.")),
    P3(7, "这本书一共108页，我____看到20页。", ["才"], ("才: only 20 of 108.", "才: baru 20 dari 108.")),
    P3(8, "你买了票____能坐地铁。", ["才"], ("v₁,才+v₂: you must buy a ticket first.", "v₁,才+v₂: harus beli tiket dulu.")),
    # 四、选词填空 结果补语 (answers: lesson 6 p. 82, lesson 4 p. 37 and p. 76)
    P4(1, "老师讲得很慢，我听____了。", ["懂"]),
    P4(2, "A：我叫你，你怎么不回答？ B：对不起，我正听录音呢，没听____。", ["见"]),
    P4(3, "我们五点半才能回____宿舍。", ["到"]),
    P4(4, "对不起，我看____时间了，所以来晚了。", ["错"]),
    P4(5, "快开____窗户吧，屋子里太热了。", ["开"]),
    P4(6, "合____书吧，现在开始听写。", ["上"]),
    P4(7, "A：我给你的书你看____了没有？ B：还没有看____呢。", ["完", "完"]),
    P4(8, "你可以把句子翻译____中文吗？", ["成"]),
    P4(9, "这篇课文我读得不____。", ["熟"]),
    P4(10, "A：我们马上要期中考试了，你知道考____第几课吗？B：知道，考____第六课。", ["到", "到"]),
    # 五、用所给词语完成对话 (open; sample answers [ADDED])
    O("五、完成对话 · 1 [ADDED]", ("A：你为什么没有来上课？B：____。(因为……所以……)", "A：你为什么没有来上课？B：____。(因为……所以……)"),
      ("因为我病了，所以没有来上课。", "因为我病了，所以没有来上课。")),
    O("五、完成对话 · 2 [ADDED]", ("A：明天你可以陪我去买衣服吗？B：____。(要是……就……)", "A：明天你可以陪我去买衣服吗？B：____。(要是……就……)"),
      ("要是明天我有时间，我就陪你去。", "要是明天我有时间，我就陪你去。")),
    O("五、完成对话 · 3 [ADDED]", ("A：这个房子房租贵吗？B：____。(虽然……但是……)", "A：这个房子房租贵吗？B：____。(虽然……但是……)"),
      ("虽然房租有点儿贵，但是房子很好。", "虽然房租有点儿贵，但是房子很好。")),
    # 六、选择正确的答案 (answers: lesson 2 p. 38, lesson 5 p. 72 and p. 76, lesson 6 p. 58)
    Q("六、选择 · 1", ("你去没去医院？", "你去没去医院？"), ["不去", "去了", "去", "再去"], 1,
      ("v.没v.? asks about the past: answer 去了 or 没去.", "v.没v.? menanyakan masa lalu: jawab 去了 atau 没去.")),
    Q("六、选择 · 2", ("我来中国已经____了。", "我来中国已经____了。"), ["二十年多", "二十多年", "多二十年"], 1,
      ("Over 10: 多 after the number.", "Di atas 10: 多 sesudah bilangan.")),
    Q("六、选择 · 3", ("昨天晚上我一直学习到很晚才睡，只____。", "昨天晚上我一直学习到很晚才睡，只____。"), ["睡觉了四五个小时", "四五个小时睡觉", "睡了四五个小时觉", "睡四个五个小时觉"], 2,
      ("睡觉 is a separable verb: the time goes inside.", "睡觉 adalah kata kerja terpisah: waktunya di tengah.")),
    Q("六、选择 · 4", ("我已经学了____汉语了。", "我已经学了____汉语了。"), ["一年多", "一多年", "多一年"], 0,
      ("Under 10: 多 after the measure word.", "Di bawah 10: 多 sesudah kata satuan.")),
    Q("六、选择 · 5", ("我姐姐比我____。", "我姐姐比我____。"), ["胖一点儿", "很胖", "胖得很", "三斤胖"], 0,
      ("No 很 in a 比 sentence; the amount goes after the adjective.", "Tanpa 很 dalam kalimat 比; jumlahnya sesudah kata sifat.")),
    # 七、改错句 (answers: review PPT p. 37, p. 84; lesson 6 p. 68)
    P7(1, "玛丽常常去了操场锻炼身体。", ["玛丽常常去操场锻炼身体。"], ("常常 is a habit: no 了.", "常常 adalah kebiasaan: tanpa 了.")),
    P7(2, "她感冒了，昨天我去了看她。", ["她感冒了，昨天我去看了她。", "她感冒了，昨天我去看她了。"],
       ("Serial verb: no 了 after 去. The review PPT's answer is 去看了她.", "Kata kerja berangkai: tanpa 了 sesudah 去. Jawaban PPT review: 去看了她.")),
    P7(3, "我已经做了完今天的作业。", ["我已经做完了今天的作业。"], ("了 after the complement 完.", "了 sesudah pelengkap 完.")),
    P7(4, "吃完晚饭，我常常跟朋友聊天一会儿。", ["吃完晚饭，我常常跟朋友聊一会儿天。"], ("Separable verb: 聊一会儿天.", "Kata kerja terpisah: 聊一会儿天.")),
    P7(5, "麦克比我一点儿高。", ["麦克比我高一点儿。"], ("一点儿 goes after the adjective.", "一点儿 sesudah kata sifat.")),
    # 八、阅读理解 逛公园 (answers from the text [ADDED]; the passage is the 阅读 of lesson 6)
    F("八、阅读 逛公园 · 1 [ADDED]", ("Read 逛公园 (lesson 6 reading). 她们怎么去的公园？", "Baca 逛公园 (bacaan pelajaran 6). 她们怎么去的公园？"),
      ["骑自行车去的。", "骑自行车去", "骑自行车", "她们骑自行车去的"], ("罗兰说……我们最好骑自行车去。", "罗兰说……我们最好骑自行车去。")),
    O("八、阅读 逛公园 · 2 [ADDED]", ("她们多久到的公园？排了多久的队买到票？", "她们多久到的公园？排了多久的队买到票？"),
      ("半个小时就到公园了。排了五分钟才买到票。", "半个小时就到公园了。排了五分钟才买到票。")),
    F("八、阅读 逛公园 · 3 [ADDED]", ("她们到公园以后先做什么了？", "她们到公园以后先做什么了？"),
      ["先爬山了。", "先爬山", "爬山", "她们先爬山了"], ("我和罗兰先爬山。", "我和罗兰先爬山。")),
    O("八、阅读 逛公园 · 4 [ADDED]", ("很多人在公园里做什么？", "很多人在公园里做什么？"),
      ("很多人在湖边散步，还有不少人在湖上划船。", "很多人在湖边散步，还有不少人在湖上划船。")),
    F("八、阅读 逛公园 · 5 [ADDED]", ("她们还会再来这个公园吗？", "她们还会再来这个公园吗？"),
      ["会。", "会", "会再来", "会，以后可以再来"], ("罗兰说：\"以后我们可以再来。\"", "罗兰说：\"以后我们可以再来。\"")),
]
