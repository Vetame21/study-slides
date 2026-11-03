"""Lesson 4 第4课 我都做对了. Source: Compre Chapter 4.pdf (83 pages)."""
from cclib import L, S, Q, W, F

CHAPTER = {"en": "第4课 我都做对了 (I got them all right)",
           "id": "第4课 我都做对了 (Saya menjawab semuanya dengan benar)"}

NONE = ("", "")

SLIDES = [
    S("WHAT", ("[ADDED] How to Read This Lesson", "[ADDED] Cara Membaca Pelajaran Ini"), [], intro=(
        "As before: the 汉字, word pinyin and English word meanings come from the teacher's slides.\n"
        "[ADDED] for this site: sentence pinyin and all sentence translations. Check them with your teacher.",
        "Sama seperti sebelumnya: 汉字, pinyin kosakata, dan arti kata bahasa Inggris berasal dari slide guru.\n"
        "[ADDED] untuk situs ini: pinyin kalimat dan semua terjemahan kalimat. Cek lagi dengan gurumu."),
      check=(("Which pinyin comes from the teacher's slides?", "The vocabulary pinyin."),
             ("Pinyin mana yang berasal dari slide guru?", "Pinyin kosakata."))),
    S("WHY", ("Warm-up: Your Last Exam", "Pemanasan: Ujian Terakhirmu"), [
        L("上一次考试是什么时候？", "Shàng yí cì kǎoshì shì shénme shíhou?", "When was your last exam?", "Kapan ujian terakhirmu?"),
        L("上一次考试难不难？", "Shàng yí cì kǎoshì nán bu nán?", "Was the last exam hard?", "Ujian terakhir sulit tidak?"),
      ], check=(("Answer: 上一次考试难不难？", "Your own answer, e.g. 不太难。"), ("Jawab: 上一次考试难不难？", "Jawabanmu sendiri, misalnya 不太难。"))),

    # New words (1) ----------------------------------------------------------------------------
    S("WHAT", ("考试 kǎoshì and 成绩 chéngjì", "考试 kǎoshì dan 成绩 chéngjì"), [
        L("去考试 / 一次考试 / 考试结果", "qù kǎoshì / yí cì kǎoshì / kǎoshì jiéguǒ", "go to an exam / one exam / exam result", "pergi ujian / satu kali ujian / hasil ujian"),
        L("他对这次考试结果很满意。", "Tā duì zhè cì kǎoshì jiéguǒ hěn mǎnyì.", "He's very happy with this exam result.", "Dia sangat puas dengan hasil ujian kali ini."),
        L("他的考试成绩是0分。", "Tā de kǎoshì chéngjì shì líng fēn.", "His exam score was 0.", "Nilai ujiannya 0."),
      ], word=[W("考试", "kǎo shì", ("v. / n.", "v. / n."), ("to take an exam; exam", "ujian")), W("成绩", "chéngjì", NONE, ("exam result; grade", "nilai"))],
      check=(("Say \"exam score\".", "考试成绩"), ("Katakan \"nilai ujian\".", "考试成绩"))),
    S("WHAT", ("题 tí, 道 dào, 完 wán", "题 tí, 道 dào, 完 wán"), [
        L("一道题", "yí dào tí", "one question", "satu soal"),
        L("这道题我做错了。", "Zhè dào tí wǒ zuò cuò le.", "I got this question wrong.", "Soal ini saya jawab salah."),
        L("做完了 ↔ 没做完", "zuò wán le ↔ méi zuò wán", "finished ↔ not finished", "sudah selesai ↔ belum selesai"),
        L("考完试 / 写完作业 / 看完电影 / 吃完晚饭", "kǎo wán shì / xiě wán zuòyè / kàn wán diànyǐng / chī wán wǎnfàn", "finish the exam / homework / film / dinner", "selesai ujian / PR / film / makan malam"),
      ], word=[W("题", "tí", NONE, ("question; problem", "soal")), W("道", "dào", NONE, ("MW for questions", "kata satuan untuk soal")), W("完", "wán", NONE, ("to finish; to be over", "selesai"))],
      check=(("Which measure word goes with 题？", "道: 一道题"), ("Kata satuan apa yang dipakai untuk 题？", "道: 一道题"))),
    S("WHAT", ("词 cí and 句子 jùzi", "词 cí dan 句子 jùzi"), [
        L("词 → 词语 (组词)", "cí → cíyǔ (zǔ cí)", "word → words (making words)", "kata → kata-kata (menyusun kata)"),
        L("电 → 充电 / 充电宝 / 电脑 / 电视", "diàn → chōngdiàn / chōngdiànbǎo / diànnǎo / diànshì", "electricity → charge / power bank / computer / TV", "listrik → mengisi daya / power bank / komputer / TV"),
        L("词语+词语=句子", "cíyǔ + cíyǔ = jùzi", "words + words = a sentence", "kata + kata = kalimat"),
      ], word=[W("词", "cí", NONE, ("word", "kata")), W("句子", "jùzi", NONE, ("sentence", "kalimat"))],
      check=(("Make a word with 电.", "e.g. 电脑 / 电视 / 充电"), ("Buat kata dengan 电.", "misalnya 电脑 / 电视 / 充电"))),
    S("WHAT", ("看见 kànjiàn: To See", "看见 kànjiàn: Melihat"), [
        L("你看见花了吗？/ 你看见太阳了吗？", "Nǐ kànjiàn huā le ma? / Nǐ kànjiàn tàiyáng le ma?", "Can you see the flowers? / the sun?", "Kamu melihat bunganya? / mataharinya?"),
        L("好久不见 / 我想见见你的中国朋友。", "Hǎojiǔ bú jiàn / Wǒ xiǎng jiànjian nǐ de Zhōngguó péngyou.", "Long time no see / I'd like to meet your Chinese friend.", "Lama tidak bertemu / Saya ingin bertemu teman Tionghoamu."),
        L("听见 / 闻见 / 梦见", "tīngjiàn / wénjiàn / mèngjiàn", "hear / smell (sniff) / dream of", "mendengar / mencium (bau) / memimpikan"),
      ], word=[W("看见", "kàn jiàn", NONE, ("to see; to catch sight", "melihat"))],
      check=(("What does 见 add in 听见？", "The result: you actually hear it."), ("Apa yang ditambahkan 见 dalam 听见？", "Hasilnya: benar-benar terdengar."))),
    S("WHAT", ("干什么 gàn shénme", "干什么 gàn shénme"), [
        L("你买这本书干什么？", "Nǐ mǎi zhè běn shū gàn shénme?", "Why are you buying this book? (=你为什么买这本书？ 询问原因)", "Kenapa kamu beli buku ini? (=你为什么买这本书？ menanyakan alasan)"),
        L("田芳说它很好看。", "Tián Fāng shuō tā hěn hǎokàn.", "Tian Fang says it's very good.", "Kata Tian Fang buku itu bagus."),
        L("你在干什么？我在写作业。", "Nǐ zài gàn shénme? Wǒ zài xiě zuòyè.", "What are you doing? I'm doing homework. (=你正在做什么？)", "Kamu sedang apa? Saya sedang mengerjakan PR. (=你正在做什么？)"),
        L("你是干什么的？我是老师。/ 我是学生。", "Nǐ shì gàn shénme de? Wǒ shì lǎoshī. / Wǒ shì xuésheng.", "What do you do? I'm a teacher. / I'm a student. (询问职业、身份)", "Kamu kerja apa? Saya guru. / Saya pelajar. (menanyakan pekerjaan)"),
      ], word=[W("干什么", "gàn shénme", NONE, ("for what purpose; why", "untuk apa; kenapa"))],
      check=(("你是干什么的？ asks about…", "Your job or identity."), ("你是干什么的？ menanyakan…", "Pekerjaan atau identitasmu."))),
    S("WHAT", ("糟糕 zāogāo: Terrible", "糟糕 zāogāo: Gawat"), [
        L("糟糕，自行车坏了。", "Zāogāo, zìxíngchē huài le.", "Oh no, my bike's broken.", "Gawat, sepedanya rusak."),
        L("糟糕，没带伞。", "Zāogāo, méi dài sǎn.", "Oh no, I didn't bring an umbrella.", "Gawat, tidak bawa payung."),
        L("今天真是糟糕的一天。", "Jīntiān zhēn shì zāogāo de yì tiān.", "Today has been a really bad day.", "Hari ini benar-benar hari yang buruk."),
      ], word=[W("糟糕", "zāogāo", NONE, ("terrible; too bad", "gawat; buruk"))],
      check=(("Translate: 糟糕，没带伞。", "Oh no, I didn't bring an umbrella."), ("Terjemahkan: 糟糕，没带伞。", "Gawat, tidak bawa payung."))),
    S("WHAT", ("成 chéng and 回信 huíxìn", "成 chéng dan 回信 huíxìn"), [
        L("\"的\"写成这个\"地\"了。", "\"De\" xiě chéng zhège \"de\" le.", "I wrote 的 as 地.", "\"的\" saya tulis menjadi \"地\"."),
        L("\"是不是\"说成\"四不四\"了。", "\"Shì bu shì\" shuō chéng \"sì bu sì\" le.", "I said 是不是 as 四不四.", "\"是不是\" terucap menjadi \"四不四\"."),
        L("课文可以改成对话。", "Kèwén kěyǐ gǎi chéng duìhuà.", "The text can be turned into a dialogue.", "Teksnya bisa diubah menjadi dialog."),
        L("他收到了朋友的回信。/ 写信", "Tā shōudào le péngyou de huíxìn. / xiě xìn", "He got his friend's reply. / write a letter", "Dia menerima balasan dari temannya. / menulis surat"),
      ], word=[W("成", "chéng", NONE, ("to become; to turn into", "menjadi")), W("回信", "huí xìn", NONE, ("to reply to an email", "membalas surat"))],
      intro=("Pattern: v.+成.", "Pola: v.+成."),
      check=(("Say \"wrote 的 as 地\".", "\"的\"写成\"地\"了。"), ("Katakan \"menulis 的 menjadi 地\".", "\"的\"写成\"地\"了。"))),

    # Text (1) ---------------------------------------------------------------------------------
    S("HOW", ("课文（一） 我都做对了 (1/2)", "课文（一） 我都做对了 (1/2)"), [
        L("玛丽：你今天考得怎么样？", "Mǎlì: Nǐ jīntiān kǎo de zěnmeyàng?", "Mary: How did your exam go today?", "Mary: Ujianmu hari ini bagaimana?"),
        L("罗兰：这次没考好。题太多了，我没有做完。你做完了没有？", "Luólán: Zhè cì méi kǎo hǎo. Tí tài duō le, wǒ méiyǒu zuò wán. Nǐ zuò wán le méiyǒu?", "Luo Lan: Not well this time. There were too many questions and I didn't finish. Did you?", "Luo Lan: Kali ini kurang bagus. Soalnya terlalu banyak, aku tidak selesai. Kamu selesai?"),
        L("玛丽：我都做完了，但是没都做对，做错了两道题，所以成绩不会太好。", "Mǎlì: Wǒ dōu zuò wán le, dànshì méi dōu zuò duì, zuò cuò le liǎng dào tí, suǒyǐ chéngjì bú huì tài hǎo.", "Mary: I finished them all, but didn't get them all right. I got two wrong, so my score won't be great.", "Mary: Aku selesai semua, tapi tidak semua benar. Dua soal salah, jadi nilaiku tidak akan terlalu bagus."),
        L("罗兰：语法题不太难，我觉得都做对了。听力比较难，很多句子我没听懂。", "Luólán: Yǔfǎ tí bú tài nán, wǒ juéde dōu zuò duì le. Tīnglì bǐjiào nán, hěn duō jùzi wǒ méi tīng dǒng.", "Luo Lan: The grammar wasn't too hard; I think I got it all right. The listening was harder; I didn't understand many sentences.", "Luo Lan: Soal tata bahasa tidak terlalu sulit, kurasa benar semua. Mendengarnya agak sulit, banyak kalimat yang tidak kupahami."),
      ], intro=("考完试以后……", "考完试以后……"),
      check=(("罗兰考得怎么样？", "这次没考好。"), ("罗兰考得怎么样？", "这次没考好。"))),
    S("HOW", ("课文（一） 我都做对了 (2/2)", "课文（一） 我都做对了 (2/2)"), [
        L("玛丽：我也不知道做对了没有。我的词典呢？", "Mǎlì: Wǒ yě bù zhīdào zuò duì le méiyǒu. Wǒ de cídiǎn ne?", "Mary: I don't know if I got them right either. Where's my dictionary?", "Mary: Aku juga tidak tahu benar atau tidak. Kamusku mana?"),
        L("罗兰：我没看见你的词典。你找词典干什么？", "Luólán: Wǒ méi kànjiàn nǐ de cídiǎn. Nǐ zhǎo cídiǎn gàn shénme?", "Luo Lan: I haven't seen it. What do you want it for?", "Luo Lan: Aku tidak lihat kamusmu. Kamu cari kamus untuk apa?"),
        L("玛丽：我查一个词，看看写对了没有。……糟糕，写错了，是这个\"得\",我写成这个\"的\"了。", "Mǎlì: Wǒ chá yí ge cí, kànkan xiě duì le méiyǒu. …… Zāogāo, xiě cuò le, shì zhège \"de\", wǒ xiě chéng zhège \"de\" le.", "Mary: I want to look up a word and see if I wrote it right. …Oh no, I got it wrong: it's this 得, and I wrote 的.", "Mary: Aku mau cek satu kata, benar atau tidak tulisanku. …Gawat, salah: seharusnya 得, aku tulis 的."),
        L("罗兰：别查了，休息休息吧。快打开电脑，看看电视剧吧。", "Luólán: Bié chá le, xiūxi xiūxi ba. Kuài dǎkāi diànnǎo, kànkan diànshìjù ba.", "Luo Lan: Stop checking and take a rest. Turn on the computer and watch a TV series.", "Luo Lan: Sudah, jangan dicek lagi, istirahat saja. Nyalakan komputer, nonton drama, yuk."),
        L("玛丽：我的衣服还没有洗完呢，还得给我妹妹回信。", "Mǎlì: Wǒ de yīfu hái méiyǒu xǐ wán ne, hái děi gěi wǒ mèimei huíxìn.", "Mary: I haven't finished washing my clothes, and I still have to reply to my sister.", "Mary: Bajuku belum selesai dicuci, dan aku masih harus membalas surat adikku."),
        L("罗兰：看完电视剧再洗吧。", "Luólán: Kàn wán diànshìjù zài xǐ ba.", "Luo Lan: Wash them after the series.", "Luo Lan: Cuci nanti saja sesudah nonton."),
      ], check=(("玛丽把什么词写成什么了？", "把\"得\"写成\"的\"了。"), ("玛丽把什么词写成什么了？", "把\"得\"写成\"的\"了。"))),

    # New words (2) ----------------------------------------------------------------------------
    S("WHAT", ("故事 gùshi and 有意思 yǒu yìsi", "故事 gùshi dan 有意思 yǒu yìsi"), [
        L("讲故事", "jiǎng gùshi", "tell a story", "bercerita"),
        L("妈妈正在给孩子讲故事。", "Māma zhèngzài gěi háizi jiǎng gùshi.", "Mum is telling the child a story.", "Ibu sedang mendongeng untuk anaknya."),
        L("这部电影非常有意思。", "Zhè bù diànyǐng fēicháng yǒu yìsi.", "This film is really interesting.", "Film ini sangat menarik."),
      ], word=[W("故事", "gùshi", NONE, ("story", "cerita")), W("有意思", "yǒu yìsi", NONE, ("interesting", "menarik"))],
      check=(("Say \"tell a story\".", "讲故事"), ("Katakan \"bercerita\".", "讲故事"))),
    S("WHAT", ("页 yè and 笑 xiào", "页 yè dan 笑 xiào"), [
        L("这本书一共有150页。", "Zhè běn shū yígòng yǒu yìbǎi wǔshí yè.", "This book has 150 pages in all.", "Buku ini totalnya 150 halaman."),
        L("请把书翻到第27页。/ 一页 / 页码", "Qǐng bǎ shū fān dào dì-èrshíqī yè. / yí yè / yèmǎ", "Please turn to page 27. / one page / page number", "Tolong buka halaman 27. / satu halaman / nomor halaman"),
        L("大笑 / 微笑 / 偷笑", "dàxiào / wēixiào / tōuxiào", "laugh / smile / snicker", "tertawa / tersenyum / tertawa diam-diam"),
      ], word=[W("页", "yè", ("MW", "kata satuan"), ("page", "halaman")), W("笑", "xiào", NONE, ("to smile; to laugh", "tersenyum; tertawa"))],
      check=(("Say \"turn to page 27\".", "翻到第27页"), ("Katakan \"buka halaman 27\".", "翻到第27页"))),
    S("WHAT", ("会话 huìhuà and 念 niàn", "会话 huìhuà dan 念 niàn"), [
        L("玛丽和杰克在练习汉语会话。", "Mǎlì hé Jiékè zài liànxí Hànyǔ huìhuà.", "Mary and Jack are practising Chinese conversation.", "Mary dan Jack sedang latihan percakapan bahasa Mandarin."),
        L("念书", "niàn shū", "read aloud; study", "membaca (keras); belajar"),
        L("这个小女孩在念书。", "Zhège xiǎo nǚhái zài niàn shū.", "This little girl is reading aloud.", "Gadis kecil ini sedang membaca."),
      ], word=[W("会话", "huìhuà", NONE, ("to converse; conversation", "bercakap; percakapan")), W("念", "niàn", NONE, ("to read aloud", "membaca keras"))],
      check=(("Translate: 练习汉语会话", "practise Chinese conversation"), ("Terjemahkan: 练习汉语会话", "latihan percakapan bahasa Mandarin"))),
    S("WHAT", ("答 dá and 办法 bànfǎ", "答 dá dan 办法 bànfǎ"), [
        L("回答 / 小丽在举手回答问题。", "huídá / Xiǎolì zài jǔ shǒu huídá wèntí.", "answer / Xiaoli is raising her hand to answer.", "menjawab / Xiaoli mengangkat tangan untuk menjawab."),
        L("老师的问题她都答对了。", "Lǎoshī de wèntí tā dōu dá duì le.", "She got all the teacher's questions right.", "Semua pertanyaan guru dia jawab dengan benar."),
        L("他想到一个好办法。", "Tā xiǎng dào yí ge hǎo bànfǎ.", "He came up with a good idea.", "Dia menemukan cara yang bagus."),
        L("没办法，我们只能打车去机场了。", "Méi bànfǎ, wǒmen zhǐ néng dǎchē qù jīchǎng le.", "No choice: we'll have to take a taxi to the airport.", "Tidak ada cara lain, kita terpaksa naik taksi ke bandara."),
      ], word=[W("答", "dá", NONE, ("to answer", "menjawab")), W("办法", "bànfǎ", NONE, ("way; method", "cara"))],
      check=(("Say \"no choice\".", "没办法"), ("Katakan \"tidak ada cara lain\".", "没办法"))),
    S("WHAT", ("合上 héshang and 打开 dǎkāi", "合上 héshang dan 打开 dǎkāi"), [
        L("合上书本 / 打开书本", "héshang shūběn / dǎkāi shūběn", "close the book / open the book", "menutup buku / membuka buku"),
        L("把书本打开又合上。", "Bǎ shūběn dǎkāi yòu héshang.", "Open the book and close it again.", "Buka bukunya lalu tutup lagi."),
      ], word=[W("合上", "héshang", NONE, ("to shut; to close", "menutup")), W("打开", "dǎ kāi", NONE, ("to open; to unfold", "membuka"))],
      check=(("Opposite of 打开书？", "合上书"), ("Lawan dari 打开书？", "合上书"))),
    S("WHAT", ("听见 tīngjiàn and 作业 zuòyè", "听见 tīngjiàn dan 作业 zuòyè"), [
        L("我听见了____。", "Wǒ tīngjiàn le ____.", "I heard ____.", "Saya mendengar ____."),
        L("写作业 / 做作业", "xiě zuòyè / zuò zuòyè", "do homework", "mengerjakan PR"),
        L("交作业 / 检查作业", "jiāo zuòyè / jiǎnchá zuòyè", "hand in / check homework", "mengumpulkan / memeriksa PR"),
      ], word=[W("听见", "tīng jiàn", NONE, ("to hear", "mendengar")), W("作业", "zuòyè", NONE, ("homework", "PR"))],
      check=(("Say \"hand in homework\".", "交作业"), ("Katakan \"mengumpulkan PR\".", "交作业"))),
    S("WHAT", ("熟 shú: Familiar", "熟 shú: Akrab, Hafal"), [
        L("我和他认识几十年了，很熟。", "Wǒ hé tā rènshi jǐshí nián le, hěn shú.", "I've known him for decades; we're close.", "Saya kenal dia sudah puluhan tahun, kami akrab."),
        L("熟悉 / 对……熟悉", "shúxī / duì …… shúxī", "familiar / familiar with …", "akrab / mengenal baik …"),
        L("我对这个地方很熟悉。", "Wǒ duì zhège dìfang hěn shúxī.", "I know this place well.", "Saya sangat mengenal tempat ini."),
      ], word=[W("熟", "shú", NONE, ("familiar; well acquainted", "akrab; hafal"))],
      check=(("Say \"I know this place well\".", "我对这个地方很熟悉。"), ("Katakan \"saya kenal baik tempat ini\".", "我对这个地方很熟悉。"))),

    # Text (2) ---------------------------------------------------------------------------------
    S("HOW", ("课文（二） 看完电影再做作业 (1/3)", "课文（二） 看完电影再做作业 (1/3)"), [
        L("吃完晚饭，我和玛丽回到宿舍。玛丽说，田芳借给她一本书，书里都是小故事，很有意思。", "Chī wán wǎnfàn, wǒ hé Mǎlì huídào sùshè. Mǎlì shuō, Tián Fāng jiè gěi tā yì běn shū, shū lǐ dōu shì xiǎo gùshi, hěn yǒu yìsi.", "After dinner Mary and I went back to the dorm. Mary said Tian Fang had lent her a book of short stories, very interesting.", "Habis makan malam aku dan Mary kembali ke asrama. Kata Mary, Tian Fang meminjaminya buku kumpulan cerita pendek yang menarik."),
        L("我问她：\"你看完了没有？\"她说：\"还没看完呢，才看了三十页。\"", "Wǒ wèn tā: \"Nǐ kàn wán le méiyǒu?\" Tā shuō: \"Hái méi kàn wán ne, cái kàn le sānshí yè.\"", "I asked, \"Have you finished it?\" She said, \"Not yet, I've only read thirty pages.\"", "Aku tanya, \"Sudah selesai dibaca?\" Katanya, \"Belum, baru tiga puluh halaman.\""),
        L("我问玛丽：\"都看懂了吗？\"她回答：\"有的看懂了，有的没看懂。\"", "Wǒ wèn Mǎlì: \"Dōu kàn dǒng le ma?\" Tā huídá: \"Yǒude kàn dǒng le, yǒude méi kàn dǒng.\"", "I asked, \"Do you understand it all?\" She answered, \"Some yes, some no.\"", "Aku tanya, \"Paham semua?\" Jawabnya, \"Ada yang paham, ada yang tidak.\""),
        L("\"可以让我看看吗？\"\"当然可以。\"", "\"Kěyǐ ràng wǒ kànkan ma?\" \"Dāngrán kěyǐ.\"", "\"Can I have a look?\" \"Of course.\"", "\"Boleh aku lihat?\" \"Tentu boleh.\""),
        L("我看了两个故事，也觉得很有意思。看到有意思的地方，就想笑。我对玛丽说：\"咱们可以用这些故事练习会话。\"", "Wǒ kàn le liǎng ge gùshi, yě juéde hěn yǒu yìsi. Kàn dào yǒu yìsi de dìfang, jiù xiǎng xiào. Wǒ duì Mǎlì shuō: \"Zánmen kěyǐ yòng zhèxiē gùshi liànxí huìhuà.\"", "I read two stories and found them interesting too. At the funny parts I wanted to laugh. I said to Mary: \"We can use these stories to practise conversation.\"", "Aku baca dua cerita, memang menarik. Di bagian lucu aku ingin tertawa. Aku bilang ke Mary: \"Kita bisa pakai cerita ini untuk latihan percakapan.\""),
      ], check=(("玛丽看完那本书没有？", "还没有，才看了三十页。"), ("玛丽看完那本书没有？", "还没有，才看了三十页。"))),
    S("HOW", ("课文（二） 看完电影再做作业 (2/3)", "课文（二） 看完电影再做作业 (2/3)"), [
        L("玛丽说：\"怎么练习？\"", "Mǎlì shuō: \"Zěnme liànxí?\"", "Mary said: \"How?\"", "Mary bilang: \"Latihannya bagaimana?\""),
        L("\"我念完一个故事，问你几个问题，看你能不能答对;你念完一个故事，也问我几个问题，看我能不能答对。\"", "\"Wǒ niàn wán yí ge gùshi, wèn nǐ jǐ ge wèntí, kàn nǐ néng bu néng dá duì; nǐ niàn wán yí ge gùshi, yě wèn wǒ jǐ ge wèntí, kàn wǒ néng bu néng dá duì.\"", "\"I read a story and ask you some questions to see if you can answer; then you read one and ask me.\"", "\"Aku baca satu cerita lalu tanya beberapa soal, lihat kamu bisa jawab tidak; lalu kamu baca satu cerita dan tanya aku.\""),
        L("玛丽说：\"这是个好办法。\"", "Mǎlì shuō: \"Zhè shì ge hǎo bànfǎ.\"", "Mary said: \"That's a good idea.\"", "Mary bilang: \"Ide bagus.\""),
        L("我念了一个故事，玛丽听懂了。问了她五个问题，她都答对了。", "Wǒ niàn le yí ge gùshi, Mǎlì tīng dǒng le. Wèn le tā wǔ ge wèntí, tā dōu dá duì le.", "I read a story and Mary understood it. I asked her five questions and she got them all right.", "Aku baca satu cerita dan Mary paham. Aku tanya lima soal, semuanya dia jawab benar."),
        L("她念了一个故事，合上书，问我听懂了没有。我说，有的地方没听懂。她打开书，又念了一遍，我才听懂。她也问了五个问题，我答对了四个，答错了一个。", "Tā niàn le yí ge gùshi, héshang shū, wèn wǒ tīng dǒng le méiyǒu. Wǒ shuō, yǒude dìfang méi tīng dǒng. Tā dǎkāi shū, yòu niàn le yí biàn, wǒ cái tīng dǒng. Tā yě wèn le wǔ ge wèntí, wǒ dá duì le sì ge, dá cuò le yí ge.", "She read a story, closed the book and asked if I'd understood. I said some parts not. She opened the book and read it again; only then did I understand. She asked five questions too: I got four right and one wrong.", "Dia baca satu cerita, menutup buku, lalu tanya aku paham atau tidak. Kubilang ada bagian yang tidak. Dia buka buku dan baca sekali lagi, baru aku paham. Dia juga tanya lima soal: empat benar, satu salah."),
      ], check=(("我答对了几个问题？", "答对了四个，答错了一个。"), ("我答对了几个问题？", "答对了四个，答错了一个。"))),
    S("HOW", ("课文（二） 看完电影再做作业 (3/3)", "课文（二） 看完电影再做作业 (3/3)"), [
        L("我们还没有练习完，就听见安娜在门外叫我们。我开开门问她：\"什么事？\"", "Wǒmen hái méiyǒu liànxí wán, jiù tīngjiàn Ānnà zài mén wài jiào wǒmen. Wǒ kāikai mén wèn tā: \"Shénme shì?\"", "Before we'd finished, we heard Anna calling us outside the door. I opened it and asked, \"What's up?\"", "Belum selesai latihan, kami mendengar Anna memanggil dari luar pintu. Aku buka pintu dan tanya, \"Ada apa?\""),
        L("\"晚上礼堂有电影，你们看吗？\"\"什么电影？\"", "\"Wǎnshang lǐtáng yǒu diànyǐng, nǐmen kàn ma?\" \"Shénme diànyǐng?\"", "\"There's a film in the auditorium tonight. Are you going?\" \"What film?\"", "\"Malam ini ada film di aula, kalian nonton?\" \"Film apa?\""),
        L("\"是个新电影，我不知道叫什么名字。田芳说，这个电影非常好。\"", "\"Shì ge xīn diànyǐng, wǒ bù zhīdào jiào shénme míngzi. Tián Fāng shuō, zhège diànyǐng fēicháng hǎo.\"", "\"A new one, I don't know its name. Tian Fang says it's very good.\"", "\"Film baru, aku tidak tahu judulnya. Kata Tian Fang filmnya bagus sekali.\""),
        L("\"想看。但是我今天的作业还没有做完呢，课文也读得不太熟。\"", "\"Xiǎng kàn. Dànshì wǒ jīntiān de zuòyè hái méiyǒu zuò wán ne, kèwén yě dú de bú tài shú.\"", "\"I'd like to. But I haven't finished today's homework, and I can't read the text smoothly yet.\"", "\"Mau. Tapi PR-ku hari ini belum selesai, dan teks pelajaran juga belum lancar kubaca.\""),
        L("安娜说：\"我也没做完呢，看完电影再做吧。\"", "Ānnà shuō: \"Wǒ yě méi zuò wán ne, kàn wán diànyǐng zài zuò ba.\"", "Anna said: \"I haven't finished either. Let's do it after the film.\"", "Anna bilang: \"Aku juga belum selesai, kerjakan sesudah nonton saja.\""),
        L("说完，我们三个就去礼堂看电影了。我们看到九点才看完。九点半我才开始做作业。做完作业已经十点半了。", "Shuō wán, wǒmen sān ge jiù qù lǐtáng kàn diànyǐng le. Wǒmen kàn dào jiǔ diǎn cái kàn wán. Jiǔ diǎn bàn wǒ cái kāishǐ zuò zuòyè. Zuò wán zuòyè yǐjīng shí diǎn bàn le.", "With that, the three of us went to the auditorium. The film didn't finish until nine. I only started my homework at half past nine, and it was 10:30 when I finished.", "Lalu kami bertiga ke aula nonton film. Filmnya baru selesai jam sembilan. Jam setengah sepuluh aku baru mulai PR, dan selesai jam setengah sebelas."),
      ], check=(("他们几点看完电影？几点做完作业？", "九点看完电影，十点半做完作业。"), ("他们几点看完电影？几点做完作业？", "九点看完电影，十点半做完作业。"))),

    # Grammar ----------------------------------------------------------------------------------
    S("WHAT", ("结果补语: Complements of Result", "结果补语: Pelengkap Hasil"), [
        L("她打错了。/ 饭做好了。/ 他写对了。", "Tā dǎ cuò le. / Fàn zuò hǎo le. / Tā xiě duì le.", "She dialled wrong. / The food is ready. / He wrote it right.", "Dia salah sambung. / Makanan sudah jadi. / Dia menulis dengan benar."),
        L("她找到了笔。/ 他写完了作业。/ 他把作业交给了老师。", "Tā zhǎo dào le bǐ. / Tā xiě wán le zuòyè. / Tā bǎ zuòyè jiāo gěi le lǎoshī.", "She found the pen. / He finished his homework. / He handed his homework to the teacher.", "Dia menemukan pulpen. / Dia selesai mengerjakan PR. / Dia menyerahkan PR ke guru."),
      ], intro=("v.+adj./v.(+了). Verbs like 完, 懂, 见, 开, 上, 到, 给, 成 and adjectives like 好, 对, 错, 熟, 早, 晚 go after a verb to show the result of the action (表示动作的结果).",
                "v.+adj./v.(+了). Kata kerja seperti 完, 懂, 见, 开, 上, 到, 给, 成 dan kata sifat seperti 好, 对, 错, 熟, 早, 晚 diletakkan sesudah kata kerja untuk menunjukkan hasil tindakan (表示动作的结果)."),
      explain=("v. = the action (动作). v. + 结果补语 = action + result. 她找笔 is only looking; 她找到了笔 means she found it. [NOTE] p. 59 writes \"Epresing … acton\"; it should be \"Expressing … action\".",
               "v. = tindakan (动作). v. + 结果补语 = tindakan + hasil. 她找笔 baru mencari; 她找到了笔 berarti sudah ketemu. [NOTE] Hlm. 59 menulis \"Epresing … acton\"; seharusnya \"Expressing … action\"."),
      check=(("她找笔 or 她找到了笔: which one has found it?", "她找到了笔"), ("她找笔 atau 她找到了笔: mana yang sudah ketemu?", "她找到了笔"))),
    S("HOW", ("结果补语: Examples", "结果补语: Contoh"), [
        L("我听懂了老师的话。", "Wǒ tīng dǒng le lǎoshī de huà.", "I understood what the teacher said.", "Saya paham perkataan guru."),
        L("我看见玛丽了，她在操场打太极拳呢。", "Wǒ kànjiàn Mǎlì le, tā zài cāochǎng dǎ tàijíquán ne.", "I saw Mary; she's doing tai chi on the field.", "Saya melihat Mary, dia sedang tai chi di lapangan."),
        L("今天的作业我做完了。", "Jīntiān de zuòyè wǒ zuò wán le.", "I've finished today's homework.", "PR hari ini sudah saya selesaikan."),
        L("我答错了两道题。", "Wǒ dá cuò le liǎng dào tí.", "I got two questions wrong.", "Saya salah menjawab dua soal."),
      ], check=(("Say \"I understood the teacher\".", "我听懂了老师的话。"), ("Katakan \"saya paham perkataan guru\".", "我听懂了老师的话。"))),
    S("REMEMBER", ("Word Order: v.+结果补语+了+O.", "Urutan: v.+结果补语+了+O."), [
        L("我看了错题。→ 我看题错了。", "Wǒ kàn le cuò tí. → Wǒ kàn tí cuò le.", "(Only the object comes after the complement.)", "(Objek diletakkan sesudah pelengkap.)"),
        L("我没看见你的词典。≠ 我没看你的词典。", "Wǒ méi kànjiàn nǐ de cídiǎn. ≠ Wǒ méi kàn nǐ de cídiǎn.", "I didn't see your dictionary. ≠ I didn't look at your dictionary.", "Saya tidak melihat kamusmu (tidak ketemu). ≠ Saya tidak membaca kamusmu."),
        L("我做错了两道题。", "Wǒ zuò cuò le liǎng dào tí.", "I got two questions wrong.", "Saya salah mengerjakan dua soal."),
        L("我只翻译对了一个句子。", "Wǒ zhǐ fānyì duì le yí ge jùzi.", "I only translated one sentence correctly.", "Saya cuma benar menerjemahkan satu kalimat."),
      ], intro=("① With both a complement and an object, the object goes after the complement. ② 了 goes after the complement and before the object.",
                "① Kalau ada pelengkap dan objek, objek diletakkan sesudah pelengkap. ② 了 diletakkan sesudah pelengkap, sebelum objek."),
      check=(("Put 了 in: 我做错两道题。", "我做错了两道题。"), ("Masukkan 了: 我做错两道题。", "我做错了两道题。"))),
    S("REMEMBER", ("Negative: 没（有）+v.+adj./v., No 了", "Negatif: 没（有）+v.+adj./v., Tanpa 了"), [
        L("你没有听见吗？安娜在叫你。", "Nǐ méiyǒu tīngjiàn ma? Ānnà zài jiào nǐ.", "Didn't you hear? Anna is calling you.", "Kamu tidak dengar? Anna memanggilmu."),
        L("这课课文我没有看懂。", "Zhè kè kèwén wǒ méiyǒu kàn dǒng.", "I didn't understand this text.", "Teks pelajaran ini tidak saya pahami."),
        L("我没有看见你的词典。", "Wǒ méiyǒu kànjiàn nǐ de cídiǎn.", "I haven't seen your dictionary.", "Saya tidak melihat kamusmu."),
        L("这件衣服没洗干净。/ 这道题我没做对。", "Zhè jiàn yīfu méi xǐ gānjìng. / Zhè dào tí wǒ méi zuò duì.", "These clothes weren't washed clean. / I didn't get this question right.", "Baju ini tidak bersih dicuci. / Soal ini tidak saya jawab benar."),
      ], intro=("In the negative form, remove 了 (去掉\"了\").", "Dalam bentuk negatif, 了 dihapus (去掉\"了\")."),
      wr=("这道题我没做对了。", "这道题我没做对。", ("没 already says the result didn't happen, so no 了.", "没 sudah menyatakan hasilnya tidak terjadi, jadi tanpa 了.")),
      check=(("Make it negative: 我听懂了。", "我没听懂。"), ("Jadikan negatif: 我听懂了。", "我没听懂。"))),
    S("HOW", ("Questions: ……了没有？ / 吗？", "Kalimat Tanya: ……了没有？ / 吗？"), [
        L("A：你看见玛丽了没有？B：看见了。", "A: Nǐ kànjiàn Mǎlì le méiyǒu? B: Kànjiàn le.", "A: Have you seen Mary? B: Yes.", "A: Kamu lihat Mary? B: Lihat."),
        L("A：今天的作业你做完了没有？B：还没做完呢。", "A: Jīntiān de zuòyè nǐ zuò wán le méiyǒu? B: Hái méi zuò wán ne.", "A: Have you finished today's homework? B: Not yet.", "A: PR hari ini sudah selesai? B: Belum."),
        L("A：这道题你做对了没有？B：没做对。", "A: Zhè dào tí nǐ zuò duì le méiyǒu? B: Méi zuò duì.", "A: Did you get this question right? B: No.", "A: Soal ini kamu jawab benar? B: Tidak."),
        L("A：他写错了吗？B：没写错。", "A: Tā xiě cuò le ma? B: Méi xiě cuò.", "A: Did he write it wrong? B: No.", "A: Dia salah tulis? B: Tidak."),
      ], intro=("v.+adj./v.+(O.)了+没有？ / 吗？", "v.+adj./v.+(O.)了+没有？ / 吗？"),
      check=(("Answer \"not yet\": 你做完了没有？", "还没做完呢。"), ("Jawab \"belum\": 你做完了没有？", "还没做完呢。"))),
    S("REMEMBER", ("结果补语: Summary", "结果补语: Ringkasan"), [
        L("肯定句：v.+adj./v.(+了) / v.+adj./v.+了+O.", "Kěndìngjù: v. + adj./v. (+ le) / v. + adj./v. + le + O.", "Affirmative", "Positif"),
        L("否定句：没（有）+v.+adj./v.", "Fǒudìngjù: méi(yǒu) + v. + adj./v.", "Negative", "Negatif"),
        L("正反疑问句：v.+adj./v.+(O.)了+没有？/吗？", "Zhèngfǎn yíwènjù: v. + adj./v. + (O.) le + méiyǒu? / ma?", "Affirmative-negative question", "Kalimat tanya positif-negatif"),
      ], check=(("Negative of 我看见了。", "我没（有）看见。"), ("Bentuk negatif dari 我看见了。", "我没（有）看见。"))),
    S("HOW", ("v.+上: Contact, Adhering", "v.+上: Bersentuhan, Menempel"), [
        L("关上门吧。", "Guān shang mén ba.", "Close the door.", "Tutup pintunya."),
        L("请同学们合上书，现在听写。", "Qǐng tóngxuémen héshang shū, xiànzài tīngxiě.", "Close your books, everyone; dictation now.", "Tutup bukunya, sekarang dikte."),
        L("请在这儿写上你的名字。", "Qǐng zài zhèr xiě shang nǐ de míngzi.", "Please write your name here.", "Tolong tulis namamu di sini."),
        L("你穿上这件衣服试试。", "Nǐ chuān shang zhè jiàn yīfu shìshi.", "Try this on.", "Coba pakai baju ini."),
      ], intro=("① Two or more things come into contact (接触到一起): 他在关门 → 他关上门了. ② One thing attaches to another (附着): 他在穿衣服 → 他穿上衣服了.",
                "① Dua benda atau lebih bersentuhan (接触到一起): 他在关门 → 他关上门了. ② Satu benda menempel pada yang lain (附着): 他在穿衣服 → 他穿上衣服了."),
      check=(("Say \"close the door\".", "关上门"), ("Katakan \"tutup pintunya\".", "关上门"))),
    S("HOW", ("v.+成: Turning Into", "v.+成: Berubah Menjadi"), [
        L("这篇会话课文，老师要我们改成叙述体。", "Zhè piān huìhuà kèwén, lǎoshī yào wǒmen gǎi chéng xùshùtǐ.", "The teacher wants us to rewrite this dialogue text as a narrative.", "Guru menyuruh kami mengubah teks dialog ini menjadi narasi."),
        L("\"是不是\",他总说成\"四不四\"。", "\"Shì bu shì\", tā zǒng shuō chéng \"sì bu sì\".", "He always says 是不是 as 四不四.", "Dia selalu mengucapkan \"是不是\" menjadi \"四不四\"."),
        L("这是个\"我\"字，你写成了\"找\"字。", "Zhè shì ge \"wǒ\" zì, nǐ xiě chéng le \"zhǎo\" zì.", "This is 我, but you wrote it as 找.", "Ini huruf \"我\", tapi kamu tulis menjadi \"找\"."),
      ], intro=("The action turns one thing into another; the result may be good or bad.", "Tindakan mengubah satu hal menjadi hal lain; hasilnya bisa baik atau buruk."),
      check=(("Say \"translate it into English\".", "翻译成英文"), ("Katakan \"terjemahkan ke bahasa Inggris\".", "翻译成英文"))),
    S("HOW", ("v.+到: Goal, Place, Time", "v.+到: Tujuan, Tempat, Waktu"), [
        L("我找到了王老师。/ 罗兰买到了那本书。", "Wǒ zhǎo dào le Wáng lǎoshī. / Luólán mǎi dào le nà běn shū.", "I found Teacher Wang. / Luo Lan managed to buy that book.", "Saya berhasil menemui Guru Wang. / Luo Lan berhasil membeli buku itu."),
        L("我昨天很晚才回到家。/ 我们学到了二十九课。", "Wǒ zuótiān hěn wǎn cái huí dào jiā. / Wǒmen xué dào le èrshíjiǔ kè.", "I didn't get home until late yesterday. / We've studied up to lesson 29.", "Kemarin saya baru sampai rumah larut. / Kami sudah belajar sampai pelajaran 29."),
        L("星期六早上我睡到九点才起床。/ 我每天晚上都学到十一二点。", "Xīngqīliù zǎoshang wǒ shuì dào jiǔ diǎn cái qǐchuáng. / Wǒ měi tiān wǎnshang dōu xué dào shíyī-èr diǎn.", "On Saturday I slept until nine. / Every night I study until eleven or twelve.", "Sabtu pagi saya tidur sampai jam sembilan. / Setiap malam saya belajar sampai jam sebelas-dua belas."),
      ], intro=("① The goal is reached (达到了目的). ② v.+到+P.: reaching a place or a stage. ③ v.+到+时间点: the action lasts until a time.",
                "① Tujuan tercapai (达到了目的). ② v.+到+P.: sampai di suatu tempat atau tahap. ③ v.+到+时间点: tindakan berlangsung sampai waktu tertentu."),
      check=(("Say \"slept until nine\".", "睡到九点"), ("Katakan \"tidur sampai jam sembilan\".", "睡到九点"))),
    S("WHAT", ("主谓词组+的+n.: S.+V. as an Attribute", "主谓词组+的+n.: S.+V. sebagai Keterangan"), [
        L("田芳借给你的那本书你看完了没有？", "Tián Fāng jiè gěi nǐ de nà běn shū nǐ kàn wán le méiyǒu?", "Have you finished the book Tian Fang lent you?", "Buku yang dipinjamkan Tian Fang sudah selesai kamu baca?"),
        L("我们现在学的词大概有一千多个。", "Wǒmen xiànzài xué de cí dàgài yǒu yìqiān duō ge.", "The words we've learnt so far are over a thousand.", "Kata yang sudah kami pelajari sekarang kira-kira lebih dari seribu."),
        L("你要的那本书我给你买到了。", "Nǐ yào de nà běn shū wǒ gěi nǐ mǎi dào le.", "I got you the book you wanted.", "Buku yang kamu mau sudah saya belikan."),
        L("我看电影 → 我看的电影 / 妈妈做饭 → 妈妈做的饭", "Wǒ kàn diànyǐng → wǒ kàn de diànyǐng / Māma zuò fàn → māma zuò de fàn", "I watch a film → the film I watched / Mum cooks → the food Mum made", "Saya nonton film → film yang saya tonton / Ibu masak → masakan ibu"),
      ], intro=("When a subject-predicate phrase is used as an attribute, add 的 (主谓词组作定语时要加\"的\").", "Kalau frasa subjek-predikat dipakai sebagai keterangan, tambahkan 的 (主谓词组作定语时要加\"的\")."),
      check=(("Change: 老师讲课。", "老师讲的课"), ("Ubah: 老师讲课。", "老师讲的课"))),

    # Reading ----------------------------------------------------------------------------------
    S("HOW", ("阅读: 玛丽病了 (1/2)", "阅读: 玛丽病了 (1/2)"), [
        L("昨天下午，我和玛丽一起去超市买东西。回到学校的时候，玛丽觉得不舒服，我就陪她一起去医院看病。", "Zuótiān xiàwǔ, wǒ hé Mǎlì yìqǐ qù chāoshì mǎi dōngxi. Huí dào xuéxiào de shíhou, Mǎlì juéde bù shūfu, wǒ jiù péi tā yìqǐ qù yīyuàn kàn bìng.", "Yesterday afternoon Mary and I went shopping at the supermarket. When we got back to school, Mary felt unwell, so I took her to the hospital.", "Kemarin sore aku dan Mary belanja ke supermarket. Waktu kembali ke sekolah, Mary merasa tidak enak badan, jadi aku menemaninya berobat ke rumah sakit."),
        L("到了医院，大夫问她：\"你怎么了？\"玛丽说：\"我头疼，很不舒服。\"", "Dào le yīyuàn, dàifu wèn tā: \"Nǐ zěnme le?\" Mǎlì shuō: \"Wǒ tóu téng, hěn bù shūfu.\"", "At the hospital the doctor asked, \"What's wrong?\" Mary said, \"I have a headache and feel awful.\"", "Di rumah sakit dokter bertanya, \"Kenapa?\" Mary bilang, \"Kepala saya sakit, tidak enak sekali.\""),
        L("大夫给她检查了检查说：\"你感冒了。烧得很厉害，三十九度五。给你打一针吧。\"", "Dàifu gěi tā jiǎnchá le jiǎnchá shuō: \"Nǐ gǎnmào le. Shāo de hěn lìhai, sānshíjiǔ dù wǔ. Gěi nǐ dǎ yì zhēn ba.\"", "The doctor examined her and said, \"You have a cold. Your fever is high, 39.5. Let me give you an injection.\"", "Dokter memeriksanya dan bilang, \"Kamu flu. Demamnya tinggi, 39,5 derajat. Saya suntik, ya.\""),
        L("玛丽说：\"不！我不打针！\"大夫说：\"打了针就不发烧了。\"玛丽说：\"不！你给我开点儿药吧。我可以吃药，但我不想打针。\"于是，大夫给她开了一些药。晚上，玛丽吃了药就睡了。", "Mǎlì shuō: \"Bù! Wǒ bù dǎzhēn!\" Dàifu shuō: \"Dǎ le zhēn jiù bù fāshāo le.\" Mǎlì shuō: \"Bù! Nǐ gěi wǒ kāi diǎnr yào ba. Wǒ kěyǐ chī yào, dàn wǒ bù xiǎng dǎzhēn.\" Yúshì, dàifu gěi tā kāi le yìxiē yào. Wǎnshang, Mǎlì chī le yào jiù shuì le.", "Mary said, \"No! No injection!\" The doctor said, \"After the injection the fever will go.\" Mary said, \"No! Just give me some medicine. I'll take pills, but I don't want an injection.\" So the doctor prescribed some. That night Mary took it and went to sleep.", "Mary bilang, \"Tidak! Saya tidak mau disuntik!\" Dokter bilang, \"Habis disuntik demamnya turun.\" Mary bilang, \"Tidak! Beri saya obat saja. Saya mau minum obat, tapi tidak mau disuntik.\" Jadi dokter memberinya obat. Malamnya Mary minum obat lalu tidur."),
      ], intro=("补充生词: 于是 yúshì (so; then), 最好 zuìhǎo (had better; it would be best).", "补充生词: 于是 yúshì (maka; lalu), 最好 zuìhǎo (sebaiknya)."),
      check=(("玛丽怎么了？", "她感冒发烧了。"), ("玛丽怎么了？", "她感冒发烧了。"))),
    S("HOW", ("阅读: 玛丽病了 (2/2)", "阅读: 玛丽病了 (2/2)"), [
        L("今天早上，她不发烧了。吃完早饭，她要去教室上课，我说：\"你在宿舍休息吧，我给你请假。\"她说：\"我的感冒已经好了，可以上课了。\"", "Jīntiān zǎoshang, tā bù fāshāo le. Chī wán zǎofàn, tā yào qù jiàoshì shàngkè, wǒ shuō: \"Nǐ zài sùshè xiūxi ba, wǒ gěi nǐ qǐngjià.\" Tā shuō: \"Wǒ de gǎnmào yǐjīng hǎo le, kěyǐ shàngkè le.\"", "This morning her fever was gone. After breakfast she wanted to go to class. I said, \"Rest in the dorm; I'll ask for leave for you.\" She said, \"My cold is better; I can go to class.\"", "Pagi ini demamnya sudah turun. Habis sarapan dia mau masuk kelas. Aku bilang, \"Istirahat di asrama saja, aku mintakan izin.\" Katanya, \"Flu-ku sudah sembuh, bisa masuk kelas.\""),
        L("到了教室，老师对玛丽说：\"玛丽，要是不舒服就回宿舍休息吧。\"", "Dào le jiàoshì, lǎoshī duì Mǎlì shuō: \"Mǎlì, yàoshi bù shūfu jiù huí sùshè xiūxi ba.\"", "In class the teacher said to Mary, \"Mary, if you feel unwell, go back to the dorm and rest.\"", "Di kelas guru bilang ke Mary, \"Mary, kalau tidak enak badan, pulang istirahat ke asrama saja.\""),
        L("上午，玛丽又有点儿发烧，下了第二节课她就回宿舍了。我对她说：\"你最好再去医院看看。\"", "Shàngwǔ, Mǎlì yòu yǒudiǎnr fāshāo, xià le dì-èr jié kè tā jiù huí sùshè le. Wǒ duì tā shuō: \"Nǐ zuìhǎo zài qù yīyuàn kànkan.\"", "In the morning Mary had a slight fever again, and after the second class she went back to the dorm. I told her, \"You'd better go to the hospital again.\"", "Siangnya Mary agak demam lagi, dan habis jam pelajaran kedua dia pulang ke asrama. Aku bilang, \"Sebaiknya kamu periksa lagi ke rumah sakit.\""),
      ], explain=("Answers from p. 81: 玛丽不舒服，头疼。/ 她感冒发烧了。没有打针，因为她不想打针。/ 没有。/ 会，因为她又发烧了。",
                  "Jawaban dari hlm. 81: 玛丽不舒服，头疼。/ 她感冒发烧了。没有打针，因为她不想打针。/ 没有。/ 会，因为她又发烧了。"),
      check=(("你觉得玛丽会再去医院吗？", "会，因为她又发烧了。"), ("你觉得玛丽会再去医院吗？", "会，因为她又发烧了。"))),
]

QUIZ_NOTE = {
    "en": "[NOTE] All exercises come from the teacher's slides: grammar, the 课文 stories, reading and fill-ins. For a fill-in, type the 汉字; punctuation does not matter.",
    "id": "[NOTE] Semua latihan berasal dari slide guru: grammar, cerita 课文, bacaan, dan isian. Untuk soal isian, ketik 汉字; tanda baca tidak dihitung.",
}

QUIZ = [
    # Review from Lesson 3 (p. 3)
    F("p. 3 复习", ("电影还有40分钟才开场，小林____已经坐在电影院里面了。(就/才)", "电影还有40分钟才开场，小林____已经坐在电影院里面了。(就/才)"), ["就"], ("Early: 就.", "Awal: 就.")),
    F("p. 3 复习", ("雨变大以后，走了四十分钟____回到宿舍。(就/才)", "雨变大以后，走了四十分钟____回到宿舍。(就/才)"), ["才"], ("Slow: 才.", "Lambat: 才.")),
    F("p. 3 复习", ("这本书一共108页，我____看到20页。(就/才)", "这本书一共108页，我____看到20页。(就/才)"), ["才"], ("Only 20 of 108: 才.", "Baru 20 dari 108: 才.")),
    # 结果补语 grammar
    F("p. 52 结果补语", ("三十分钟后，饭____了。", "三十分钟后，饭____了。"), ["做好"], ("做好: the cooking is done.", "做好: masakan sudah jadi.")),
    F("p. 51 结果补语", ("不是，你____了。这里没有麦克。", "不是，你____了。这里没有麦克。"), ["打错"], ("打错: wrong number.", "打错: salah sambung.")),
    F("p. 55 结果补语", ("我的笔呢？……我找____了！", "我的笔呢？……我找____了！"), ["到"], ("找到: found it.", "找到: ketemu.")),
    F("p. 56 结果补语", ("他写____了，所以在玩玩具。", "他写____了，所以在玩玩具。"), ["完"], ("写完: finished writing.", "写完: selesai menulis.")),
    F("p. 57 结果补语", ("他把作业交____了老师。", "他把作业交____了老师。"), ["给"], ("交给: hand to someone.", "交给: menyerahkan kepada.")),
    Q("p. 63", ("Which sentence is correct?", "Kalimat mana yang benar?"), ["我做了错两道题。", "我做错了两道题。", "我做错两道题了了。"], 1,
      ("了 goes after the complement, before the object.", "了 sesudah pelengkap, sebelum objek.")),
    Q("p. 65", ("Make it negative: 这道题我做对了。", "Jadikan negatif: 这道题我做对了。"), ["这道题我没做对。", "这道题我没做对了。", "这道题我不做对。"], 0,
      ("Negative: 没 + v. + result, no 了.", "Negatif: 没 + v. + hasil, tanpa 了.")),
    Q("p. 63", ("我没看见你的词典 means…", "我没看见你的词典 artinya…"), [("I didn't see (find) your dictionary.", "Saya tidak melihat (menemukan) kamusmu."), ("I didn't read your dictionary.", "Saya tidak membaca kamusmu.")], 0,
      ("看见 is the result: seeing it. 没看 would only mean not looking.", "看见 adalah hasilnya: terlihat. 没看 hanya berarti tidak membaca/melihat.")),
    F("p. 64 改错", ("Fix it: 我学这本书完了。", "Perbaiki: 我学这本书完了。"), ["我学完了这本书。"], ("v.+完+了+O.", "v.+完+了+O.")),
    F("p. 64 改错", ("Fix it: 我已经做了完今天的作业。", "Perbaiki: 我已经做了完今天的作业。"), ["我已经做完了今天的作业。"], ("了 after the complement 完.", "了 sesudah pelengkap 完.")),
    F("p. 64 改错", ("Fix it: 这个问题我错了回答。", "Perbaiki: 这个问题我错了回答。"), ["这个问题我回答错了。", "我回答错了这个问题。"], ("Verb first, then the result: 回答错.", "Kata kerja dulu, lalu hasilnya: 回答错.")),
    F("p. 64 改错", ("Fix it: 昨天在书店我看了我们班的同学玛丽。", "Perbaiki: 昨天在书店我看了我们班的同学玛丽。"), ["昨天在书店我看见了我们班的同学玛丽。"], ("You saw her: 看见.", "Kamu melihatnya: 看见.")),
    F("p. 64 改错", ("Fix it: 我现在能听老师的话懂了。", "Perbaiki: 我现在能听老师的话懂了。"), ["我现在能听懂了老师的话。", "我现在能听懂老师的话。"], ("听懂 + object.", "听懂 + objek.")),
    F("p. 64 改错", ("Fix it: 明天我吃早饭就去买票。(two answers)", "Perbaiki: 明天我吃早饭就去买票。(dua jawaban)"), ["明天我吃完早饭就去买票。", "明天我吃了早饭就去买票。"], ("吃完 / 吃了 + 就.", "吃完 / 吃了 + 就.")),
    F("p. 76 上成到", ("你忘记写名字了，请在试卷上写____你的名字。", "你忘记写名字了，请在试卷上写____你的名字。"), ["上"], ("写上: write it on.", "写上: tulis di atasnya.")),
    F("p. 76 上成到", ("这个会议要开____几点？", "这个会议要开____几点？"), ["到"], ("开到 + time.", "开到 + waktu.")),
    F("p. 76 上成到", ("我们五点半才能回____宿舍。", "我们五点半才能回____宿舍。"), ["到"], ("回到 + place.", "回到 + tempat.")),
    F("p. 76 上成到", ("好冷啊，你可以帮我关____窗户吗？", "好冷啊，你可以帮我关____窗户吗？"), ["上"], ("关上窗户.", "关上窗户.")),
    F("p. 76 上成到", ("知道，考____第六课。", "知道，考____第六课。"), ["到"], ("考到 + stage.", "考到 + tahap.")),
    F("p. 76 上成到", ("你可以把这个句子翻译____英文吗？", "你可以把这个句子翻译____英文吗？"), ["成"], ("翻译成: translate into.", "翻译成: menerjemahkan menjadi.")),
    F("p. 77 结果补语", ("A：老师，这个字我写____了吗？B：没有写对，你写____了。(two blanks)", "A：老师，这个字我写____了吗？B：没有写对，你写____了。(dua titik)"), ["对错", "对 错", "对，错"], ("写对 / 写错.", "写对 / 写错.")),
    F("p. 77 结果补语", ("A：现在，老师说的话你能听____吗？B：能听____。", "A：现在，老师说的话你能听____吗？B：能听____。"), ["见", "见见", "见 见"], ("听见 (the teacher's answer).", "听见 (jawaban guru).")),
    F("p. 77 结果补语", ("A：对不起，我打____了。", "A：对不起，我打____了。"), ["错"], ("打错: dialled wrong.", "打错: salah sambung.")),
    F("p. 77 结果补语", ("我看____一半儿，肚子疼得很厉害，就去医院了。", "我看____一半儿，肚子疼得很厉害，就去医院了。"), ["到"], ("看到 + stage.", "看到 + tahap.")),
    F("p. 79 定语", ("Change to 主谓词组+的+n.: 我们学习汉语。", "Ubah ke 主谓词组+的+n.: 我们学习汉语。"), ["我们学习的汉语"], ("Add 的 before the noun.", "Tambahkan 的 sebelum kata benda.")),
    F("p. 79 定语", ("Change to 主谓词组+的+n.: 妈妈做饭。", "Ubah ke 主谓词组+的+n.: 妈妈做饭。"), ["妈妈做的饭"], ("Add 的 before the noun.", "Tambahkan 的 sebelum kata benda.")),
    # Vocabulary fill-in (p. 37)
    F("p. 37 填空", ("这几____题比较难，我虽然做完了，但是不知道做对没做对。", "这几____题比较难，我虽然做完了，但是不知道做对没做对。"), ["道"], ("一道题.", "一道题.")),
    F("p. 37 填空", ("外边风很大，____上窗户吧。", "外边风很大，____上窗户吧。"), ["关"], ("关上窗户.", "关上窗户.")),
    F("p. 37 填空", ("对不起，我看____时间了，所以来晚了。", "对不起，我看____时间了，所以来晚了。"), ["错"], ("看错: misread.", "看错: salah lihat.")),
    F("p. 37 填空", ("你说得太快，我没听____，请你再说一遍，好吗？", "你说得太快，我没听____，请你再说一遍，好吗？"), ["懂"], ("听懂.", "听懂.")),
    F("p. 37 填空", ("我作业已经做完了，课文还没有念____呢。", "我作业已经做完了，课文还没有念____呢。"), ["完"], ("念完.", "念完.")),
    # 课文 (story)
    F("p. 22 课文", ("罗兰考得怎么样？", "罗兰考得怎么样？"), ["这次没考好。", "没考好"], ("罗兰: 这次没考好。", "罗兰: 这次没考好。")),
    Q("p. 22 课文", ("玛丽做完题了吗？都做对了吗？", "玛丽做完题了吗？都做对了吗？"), ["她都做完了。没有都做对，错了两道题。", "她没做完。", "她都做完了，也都做对了。"], 0,
      ("我都做完了，但是没都做对，做错了两道题。", "我都做完了，但是没都做对，做错了两道题。")),
    F("p. 22 课文", ("玛丽把什么词写成什么了？", "玛丽把什么词写成什么了？"), ["把得写成的了。", "把得写成了的"], ("是这个\"得\",我写成这个\"的\"了。", "是这个\"得\",我写成这个\"的\"了。")),
    Q("p. 22 课文", ("玛丽为什么不马上看电视剧？", "玛丽为什么不马上看电视剧？"), ["因为她的衣服还没洗完，还得给她妹妹回信。", "因为她不喜欢看电视剧。", "因为她要去考试。"], 0,
      ("我的衣服还没有洗完呢，还得给我妹妹回信。", "我的衣服还没有洗完呢，还得给我妹妹回信。")),
    F("p. 23 填空", ("罗兰：这次没考好。题太多了，我没有____。", "罗兰：这次没考好。题太多了，我没有____。"), ["做完"], ("没有做完.", "没有做完.")),
    F("p. 23 填空", ("玛丽：我都做完了，但是没都做对，____了两道题。", "玛丽：我都做完了，但是没都做对，____了两道题。"), ["做错"], ("做错了两道题.", "做错了两道题.")),
    F("p. 23 填空", ("罗兰：听力比较难，很多句子我没____。", "罗兰：听力比较难，很多句子我没____。"), ["听懂"], ("没听懂.", "没听懂.")),
    F("p. 24 填空", ("罗兰：我没看见你的词典。你找词典____？", "罗兰：我没看见你的词典。你找词典____？"), ["干什么"], ("找词典干什么？", "找词典干什么？")),
    F("p. 24 填空", ("玛丽：我的衣服还没有____呢，还得给我妹妹____。(two blanks)", "玛丽：我的衣服还没有____呢，还得给我妹妹____。(dua titik)"), ["洗完回信", "洗完 回信", "洗完，回信"], ("洗完 / 回信.", "洗完 / 回信.")),
    F("p. 42 课文", ("玛丽看完田芳借给她的那本书没有？", "玛丽看完田芳借给她的那本书没有？"), ["还没有，才看了三十页。", "还没有才看了三十页"], ("还没看完呢，才看了三十页。", "还没看完呢，才看了三十页。")),
    Q("p. 42 课文", ("我和玛丽怎么练习会话？", "我和玛丽怎么练习会话？"), ["一个人念故事、问问题，另一个人回答。", "一起看电影。", "一起写作业。"], 0,
      ("我念完一个故事，问你几个问题，看你能不能答对……", "我念完一个故事，问你几个问题，看你能不能答对……")),
    F("p. 42 课文", ("安娜来叫他们干什么？", "安娜来叫他们干什么？"), ["去礼堂看新电影。", "去礼堂看电影", "看电影"], ("晚上礼堂有电影，你们看吗？", "晚上礼堂有电影，你们看吗？")),
    F("p. 42 课文", ("他们几点看完电影？几点做完作业？", "他们几点看完电影？几点做完作业？"), ["九点看完电影，十点半做完作业。"], ("看到九点才看完……做完作业已经十点半了。", "看到九点才看完……做完作业已经十点半了。")),
    F("p. 46 填空", ("我问玛丽：\"都____了吗？\"", "我问玛丽：\"都____了吗？\""), ["看懂"], ("看懂.", "看懂.")),
    F("p. 47 填空", ("我____一个故事，问你几个问题，看你能不能____。(two blanks)", "我____一个故事，问你几个问题，看你能不能____。(dua titik)"), ["念完答对", "念完 答对", "念完，答对"], ("念完 / 答对.", "念完 / 答对.")),
    F("p. 48 填空", ("我们看到九点____看完。", "我们看到九点____看完。"), ["才"], ("Late: 才.", "Terlambat: 才.")),
    Q("p. 49 句子排序", ("A 吃完晚饭以后，罗兰和玛丽回到宿舍，开始练习会话。B 看完电影之后，她们才开始做今天的作业。C 这时安娜来叫她们，邀请大家去礼堂看电影。D 虽然作业还没有做完，但是她们还是决定去看电影。Correct order?", "A 吃完晚饭以后，罗兰和玛丽回到宿舍，开始练习会话。B 看完电影之后，她们才开始做今天的作业。C 这时安娜来叫她们，邀请大家去礼堂看电影。D 虽然作业还没有做完，但是她们还是决定去看电影。Urutan yang benar?"),
      ["A → C → D → B", "C → A → D → B", "A → D → C → B"], 0, ("The teacher's order: A → C → D → B.", "Urutan guru: A → C → D → B.")),
    # 阅读 (reading)
    Q("p. 81 阅读", ("玛丽怎么了？", "玛丽怎么了？"), ["玛丽不舒服，头疼。她感冒发烧了。", "玛丽拉肚子了。", "玛丽考试没考好。"], 0,
      ("我头疼，很不舒服 / 你感冒了。", "我头疼，很不舒服 / 你感冒了。")),
    Q("p. 81 阅读", ("玛丽打针了吗？为什么？", "玛丽打针了吗？为什么？"), ["没有，因为她不想打针。", "打了，因为她发烧了。"], 0,
      ("我可以吃药，但我不想打针。", "我可以吃药，但我不想打针。")),
    Q("p. 81 阅读", ("玛丽吃药后病好了吗？", "玛丽吃药后病好了吗？"), [("Yes", "Sudah"), ("No", "Belum")], 1,
      ("上午，玛丽又有点儿发烧。", "上午，玛丽又有点儿发烧。")),
    F("p. 81 阅读", ("你觉得玛丽会再去医院吗？", "你觉得玛丽会再去医院吗？"), ["会，因为她又发烧了。", "会"], ("The teacher's answer: 会，因为她又发烧了。", "Jawaban guru: 会，因为她又发烧了。")),
]
