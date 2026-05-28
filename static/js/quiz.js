/* ============================================
   恋愛タイプ診断 - Quiz Logic v2
   ============================================ */

const QUESTIONS = [
    {
        id: 1,
        text: "好きな人ができたとき、\n最初にどんな気持ちになる？",
        answers: [
            { text: "嫌われたくない。好かれるように頑張らなきゃ", type: "tsukushi" },
            { text: "気になって、相手がどう思ってるか知りたくなる", type: "kakunin" },
            { text: "嬉しいけど、近づきすぎるのが少し怖い", type: "kyori" },
            { text: "嬉しいけど、自分なんかでいいのかなと不安になる", type: "awase" },
        ]
    },
    {
        id: 2,
        text: "彼からLINEの返信が\n半日こなかったら？",
        answers: [
            { text: "自分が何か悪いこと言ったかなと反省する", type: "tsukushi" },
            { text: "気になって何度もスマホを見る。もう1通送りたくなる", type: "kakunin" },
            { text: "あまり気にしない。自分も返さないことあるし", type: "kyori" },
            { text: "嫌われたかもと思って、次に会ったとき相手の顔色を見る", type: "awase" },
        ]
    },
    {
        id: 3,
        text: "デートの行き先を\n決めるとき、どうする？",
        answers: [
            { text: "彼が喜びそうな場所をリサーチして提案する", type: "tsukushi" },
            { text: "どこでもいいけど、彼が本当に行きたいか気になる", type: "kakunin" },
            { text: "自分が行きたい場所を提案する。合わなければ別々でもいい", type: "kyori" },
            { text: "「どこでもいいよ」と言って彼に任せる", type: "awase" },
        ]
    },
    {
        id: 4,
        text: "恋愛がうまくいかないとき、\n自分にどんな言葉をかけてる？",
        answers: [
            { text: "「もっと頑張らなきゃ」「私の努力が足りない」", type: "tsukushi" },
            { text: "「なんでこんなに不安になるんだろう」「こんな自分が嫌」", type: "kakunin" },
            { text: "「もういいや。期待しなければ傷つかない」", type: "kyori" },
            { text: "「私には恋愛は向いてないのかも」", type: "awase" },
        ]
    },
    {
        id: 5,
        text: "付き合ってる彼に\n不満があるとき、どうする？",
        answers: [
            { text: "自分が我慢すれば丸く収まると思って飲み込む", type: "tsukushi" },
            { text: "言いたいけど、嫌われるかもと迷って結局遠回しに聞く", type: "kakunin" },
            { text: "冷める。距離を置いて様子を見る", type: "kyori" },
            { text: "言えない。どう言えばいいかもわからない", type: "awase" },
        ]
    },
    {
        id: 6,
        text: "友達に恋愛相談するとき、\nどんな話をすることが多い？",
        answers: [
            { text: "「こんなに頑張ってるのに報われない」", type: "tsukushi" },
            { text: "「彼のこの行動ってどういう意味？脈あり？」", type: "kakunin" },
            { text: "「なんか最近冷めてきた」「好きかわからなくなった」", type: "kyori" },
            { text: "「どうしたらいいかわからない」「私が悪いのかな」", type: "awase" },
        ]
    },
    {
        id: 7,
        text: "あなたにとって\n理想の恋愛は？",
        answers: [
            { text: "彼にとって一番の存在になれる関係", type: "tsukushi" },
            { text: "いつでも気持ちを確認し合える安心できる関係", type: "kakunin" },
            { text: "お互い自由で、干渉しすぎない関係", type: "kyori" },
            { text: "ありのままの自分を受け入れてもらえる関係", type: "awase" },
        ]
    },
];

// ---- Type Icon images ----
const ICON_IMAGES = {
    tsukushi: "/static/img/tsukushi.png",
    kakunin: "/static/img/kakunin.png",
    kyori: "/static/img/kyori.png",
    awase: "/static/img/awase.png",
};

// ---- Infographic card images ----
const CARD_IMAGES = {
    tsukushi: "/static/img/card_tsukushi.png",
    kakunin: "/static/img/card_kakunin.png",
    kyori: "/static/img/card_kyori.png",
    awase: "/static/img/card_awase.png",
};

// ---- Type-specific LINE URLs ----
const LINE_URLS = {
    tsukushi: "https://utage-system.com/line/open/xaGjlvPOfzzB",
    kakunin: "https://utage-system.com/line/open/0YWVR5hCHw8g",
    kyori: "https://utage-system.com/line/open/PGvPPRIv9ZNn",
    awase: "https://utage-system.com/line/open/aPk6T1SVyGto",
};

const RESULTS = {
    tsukushi: {
        name: "献身の聖女",
        badge: "尽くしすぎタイプ",
        description:
            "あなたは、好きな人のために自分を後回しにして「愛される自分」を作ろうとする傾向があります。\n\n相手の好みに合わせ、相手の機嫌を取り、相手が喜ぶことを優先する——そうやって頑張れば頑張るほど、なぜか「都合のいい女」になってしまう。\n\nそんな経験、ありませんか？",
        insight:
            "尽くせば尽くすほど、相手はそれを「当たり前」と感じ、あなたの価値は下がっていきます。自分の意見を持ち、時にNOを言える女性の方が「大切にしなきゃ」と思われます。",
        weakPoints: ["自尊感情", "自己受容感"],
    },
    kakunin: {
        name: "恋のプロファイラー",
        badge: "確認しすぎタイプ",
        description:
            "あなたは、相手の気持ちが「確定」しないと安心できないタイプです。\n\n既読がつかないと不安になる。返信の文面から脈あり・脈なしを分析する。「私のこと好き？」と聞きたくなる——心当たりはありませんか？\n\n確認すればするほど相手は離れ、離れるとさらに不安になる。この無限ループにハマっています。",
        insight:
            "確認行動は一時的に安心をくれますが、すぐにまた不安に戻ります。この「不安→確認→安心→不安」のループは、相手ではなくあなたの内側の問題。外に答えを求めている限り、安心は手に入りません。",
        weakPoints: ["自己信頼感", "自己効力感"],
    },
    kyori: {
        name: "氷の城の女王",
        badge: "距離とりすぎタイプ",
        description:
            "あなたは、好きな人ができても本気になりきれず、親密になると逃げたくなるタイプです。\n\n好きになられると冷める。深い話を避ける。「別にいなくても大丈夫」と思おうとする——本気で好きな人にだけ、なぜか振り回される。\n\nそんなパターンに心当たりはありませんか？",
        insight:
            "「期待しなければ傷つかない」「1人の方が楽」と感じるのは、自分を守るための防衛本能です。でも同時に、あなたが本当に欲しい「安心できる関係」を遠ざけています。",
        weakPoints: ["自己受容感", "自己有用感"],
    },
    awase: {
        name: "恋のカメレオン",
        badge: "合わせすぎタイプ",
        description:
            "あなたは、相手の顔色を読んで自分を合わせることが当たり前になっているタイプです。\n\n「どこ行きたい？」と聞かれても答えられない。相手が不機嫌だと自分のせいだと思う。自分が何を好きなのか、よくわからなくなっている——\n\nそんな状態ではありませんか？",
        insight:
            "自分の意見がない人は、相手にとって「一緒にいる意味」が薄くなります。意見を持っている人の方が魅力的に映り、大切にされます。「合わせること」は優しさではなく、自分を消すことです。",
        weakPoints: ["自己決定感", "自己信頼感"],
    },
};

// ---- Analytics ----
function trackEvent(event, type) {
    const body = { event };
    if (type) body.type = type;
    fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).catch(() => {});
}

// ---- State ----
let currentQuestion = 0;
let answers = [];
let isTransitioning = false;

// ---- DOM ----
const $ = (id) => document.getElementById(id);
const startScreen = $("start-screen");
const quizScreen = $("quiz-screen");
const loadingScreen = $("loading-screen");
const resultScreen = $("result-screen");
const progressBar = $("progress-bar");
const progressFill = $("progress-fill");

// ---- Init ----
trackEvent("fv");
$("start-btn").addEventListener("click", startQuiz);

function startQuiz() {
    trackEvent("start");
    switchScreen(startScreen, quizScreen);
    progressBar.classList.add("visible");
    showQuestion(0);
}

function switchScreen(from, to) {
    from.classList.remove("active");
    to.classList.add("active");
}

function showQuestion(index) {
    const q = QUESTIONS[index];
    const wrapper = $("question-wrapper");

    progressFill.style.width = ((index / QUESTIONS.length) * 100) + "%";
    $("question-counter").textContent = `Q${index + 1} / ${QUESTIONS.length}`;

    // Re-trigger animation
    wrapper.style.animation = "none";
    wrapper.offsetHeight;
    wrapper.style.animation = "fadeInUp 0.4s ease";

    $("question-text").innerHTML = q.text.replace(/\n/g, "<br>");

    const answersDiv = $("answers");
    answersDiv.innerHTML = "";
    q.answers.forEach((ans) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = ans.text;
        btn.addEventListener("click", () => selectAnswer(ans.type, btn));
        answersDiv.appendChild(btn);
    });
}

function selectAnswer(type, btn) {
    if (isTransitioning) return;
    isTransitioning = true;

    btn.classList.add("selected");
    answers.push(type);
    trackEvent("q" + (currentQuestion + 1));

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < QUESTIONS.length) {
            showQuestion(currentQuestion);
        } else {
            progressFill.style.width = "100%";
            showLoading();
        }
        isTransitioning = false;
    }, 400);
}

function showLoading() {
    switchScreen(quizScreen, loadingScreen);
    progressBar.classList.remove("visible");

    const resultType = calculateResult();

    setTimeout(() => {
        showResult(resultType);
    }, 2500);
}

function calculateResult() {
    const counts = { tsukushi: 0, kakunin: 0, kyori: 0, awase: 0 };
    answers.forEach((t) => counts[t]++);

    const maxCount = Math.max(...Object.values(counts));
    const tied = Object.keys(counts).filter((k) => counts[k] === maxCount);

    if (tied.length === 1) return tied[0];

    // Tiebreaker: Q2 (index 1), then Q4 (index 3)
    if (tied.includes(answers[1])) return answers[1];
    if (tied.includes(answers[3])) return answers[3];
    return tied[0];
}

function showResult(type) {
    const data = RESULTS[type];
    const readerId = $("reader-id").value;
    const lineUrl = $("line-url").value;

    // Basic result
    $("result-badge").textContent = data.badge;
    $("result-name").textContent = data.name;
    $("result-description").innerHTML = data.description.replace(/\n/g, "<br>");
    $("result-insight").innerHTML = data.insight.replace(/\n/g, "<br>");

    // Type icon
    const iconEl = $("result-icon");
    iconEl.className = "result-icon";
    iconEl.innerHTML = `<img src="${ICON_IMAGES[type]}" alt="${data.name}">`;

    // Weak points
    $("weak-points").innerHTML = data.weakPoints
        .map((wp) => `<span class="weak-point-tag">${wp}</span>`)
        .join("");

    // Infographic card image
    $("card-img").src = CARD_IMAGES[type];
    $("card-img").alt = data.name + " 恋愛改善カード";

    // CTA section
    const ctaSection = $("cta-section");
    const stepsSection = $("line-steps-section");

    if (readerId) {
        // From UTAGE: tag and show sent message
        tagUtageReader(readerId, type);
        if (stepsSection) stepsSection.style.display = "none";
        ctaSection.innerHTML = `
            <div class="utage-sent-card">
                <div class="sent-icon">&#x2705;</div>
                <p class="sent-title">診断カードをLINEにお送りしました</p>
                <p class="sent-sub">LINEを開いて確認してください</p>
            </div>
        `;
    } else {
        // Set type-specific LINE URL
        const lineBtn = $("line-btn");
        lineBtn.href = LINE_URLS[type];
        lineBtn.addEventListener("click", () => trackEvent("line_click", type));
    }

    // Track result
    trackEvent("result", type);

    // Show result screen
    switchScreen(loadingScreen, resultScreen);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function tagUtageReader(readerId, type) {
    try {
        await fetch("/api/tag", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reader_id: readerId, type: type }),
        });
    } catch (e) {
        console.error("UTAGE tag error:", e);
    }
}
