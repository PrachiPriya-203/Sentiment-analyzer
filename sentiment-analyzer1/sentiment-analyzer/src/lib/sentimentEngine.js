const AFINN = {
    "abandon": "-2", "abandoned": "-2", "abandons": "-2", "abhor": "-3", "abhorred": "-3", "abhorrent": "-3", "abominably": "-3", "abominate": "-3", "abomination": "-3", "abusive": "-3", "accept": "1", "accepted": "1", "accuse": "-2", "ache": "-2", "aching": "-2", "admire": "2", "admired": "2", "admiring": "2", "adorable": "3", "adore": "3", "adored": "3", "afraid": "-2", "aggravate": "-2", "aggravation": "-2", "aggression": "-2", "aggressive": "-2", "agony": "-3", "agree": "1", "agreeable": "2", "alarm": "-2", "alarmed": "-2", "alarming": "-2", "alert": "1", "amazing": "4", "anger": "-3", "angry": "-3", "anguish": "-3", "annoy": "-2", "annoyance": "-2", "annoyed": "-2", "annoying": "-3", "anxiety": "-2", "anxious": "-2", "appreciate": "2", "appreciated": "2", "appreciation": "2", "arrogance": "-2", "arrogant": "-2", "aspire": "1", "asshole": "-4", "astound": "3", "astounded": "3", "astounding": "3", "atrocious": "-3", "atrocity": "-3", "awful": "-3", "awkward": "-2",
    "bad": "-3", "badly": "-3", "ban": "-2", "bankrupt": "-2", "bash": "-2", "bashing": "-2", "beautiful": "4", "beautifully": "3", "beauty": "3", "betrayal": "-3", "betray": "-3", "better": "2", "bias": "-1", "bliss": "3", "blissful": "3", "bored": "-2", "boring": "-2", "breakthrough": "3", "bribe": "-2", "brilliant": "3", "broken": "-2", "bullshit": "-4", "bully": "-3", "burn": "-1",
    "calm": "2", "cancel": "-1", "care": "2", "careful": "1", "careless": "-2", "celebrate": "2", "certain": "1", "challenge": "-1", "change": "1", "charm": "2", "cheap": "-1", "cheat": "-3", "cheerful": "3", "clever": "2", "clueless": "-2", "cold": "-1", "compassion": "2", "competent": "2", "complain": "-2", "complaint": "-2", "confused": "-2", "confusing": "-2", "corrupt": "-3", "corruption": "-3", "courage": "2", "courageous": "2", "creative": "2", "criminal": "-3", "crisis": "-3", "cry": "-1", "cutthroat": "-2",
    "damage": "-2", "danger": "-2", "dangerous": "-3", "dead": "-3", "deadly": "-3", "deceit": "-3", "deceitful": "-3", "deceive": "-3", "decline": "-2", "delightful": "3", "demoralizing": "-2", "deny": "-1", "depressed": "-3", "depressing": "-3", "depression": "-3", "desperate": "-3", "destroy": "-3", "destruction": "-3", "die": "-2", "disappointed": "-2", "disappointing": "-2", "disappointment": "-2", "disaster": "-3", "discriminate": "-2", "disgusting": "-3", "dishonest": "-3", "dismiss": "-1", "disparage": "-2", "disrespect": "-2", "doubt": "-1", "dread": "-2", "dreadful": "-3",
    "effective": "2", "efficient": "2", "empower": "2", "encourage": "2", "enjoy": "2", "enjoyable": "2", "enjoyment": "2", "enlighten": "2", "epic": "3", "evil": "-3", "excellent": "3", "exceptional": "3", "exciting": "3", "exhausted": "-2", "exhausting": "-2", "exploit": "-2", "exquisite": "3",
    "fail": "-3", "failure": "-3", "fake": "-2", "fantastic": "4", "fascinated": "2", "fascinating": "2", "fatal": "-3", "fear": "-3", "fearful": "-3", "fragile": "-1", "fraud": "-3", "friendly": "2", "frustrated": "-2", "frustrating": "-2", "frustration": "-3", "funny": "2", "furious": "-3",
    "genuine": "2", "ghost": "-1", "glad": "2", "glorious": "3", "gorgeous": "4", "grateful": "3", "gratitude": "3", "greed": "-2", "greedy": "-2", "grief": "-3", "grow": "1", "guilty": "-2",
    "happy": "3", "hard": "-1", "harm": "-2", "hate": "-4", "hated": "-4", "hatred": "-4", "helpful": "2", "helpless": "-2", "honest": "2", "honesty": "2", "hopeful": "2", "hopeless": "-3", "horrible": "-3", "horrifying": "-4", "hurt": "-2",
    "ignorant": "-2", "ignorance": "-2", "illegal": "-3", "impressed": "2", "improve": "2", "incredible": "4", "indifferent": "-1", "injustice": "-3", "inspire": "2", "inspired": "2", "insult": "-2", "insulted": "-2", "irate": "-3", "irresponsible": "-2",
    "joyful": "3", "joyous": "3", "joyfully": "3",
    "kind": "2", "kindly": "2", "kindness": "3",
    "liar": "-3", "lies": "-3", "lie": "-3", "lively": "2", "lonely": "-2", "love": "3", "lovely": "3", "loving": "3", "loyal": "2", "loyalty": "2",
    "magnificent": "4", "manipulate": "-2", "manipulative": "-2", "marvelous": "3", "meaningful": "2", "mediocre": "-1", "miserable": "-3", "miserably": "-2", "misery": "-3", "mislead": "-2", "mistrust": "-2",
    "negative": "-1", "neglect": "-2", "nervous": "-2", "nice": "2", "nightmare": "-3",
    "offend": "-2", "offensive": "-3", "oppression": "-3", "optimism": "2", "optimistic": "2", "outstanding": "3", "overwhelmed": "-2", "overwhelm": "-1",
    "pain": "-3", "panic": "-3", "paranoid": "-2", "passion": "2", "passionate": "2", "pathetic": "-2", "peaceful": "2", "perfect": "4", "perfection": "3", "positive": "2", "powerless": "-2", "productive": "2", "progress": "2", "proud": "2", "punish": "-2",
    "racism": "-3", "racist": "-3", "radiant": "3", "rage": "-3", "reliable": "2", "remarkable": "3", "resilient": "2", "respect": "2", "responsible": "2", "ridiculous": "-2", "rude": "-3",
    "sad": "-2", "sadness": "-2", "satisfy": "2", "satisfied": "2", "scam": "-3", "scared": "-2", "shame": "-2", "shameful": "-2", "shocked": "-1", "sick": "-2", "sincere": "2", "slander": "-2", "smart": "2", "sorrow": "-3", "sorry": "-1", "spectacular": "4", "stellar": "3", "stress": "-2", "stressed": "-2", "struggle": "-2", "stupid": "-3", "successful": "3", "suffer": "-3", "superb": "4", "support": "2", "supportive": "2",
    "terrible": "-3", "terrific": "3", "terrified": "-3", "terrifying": "-4", "thankful": "2", "thankfulness": "2", "toxic": "-3", "trauma": "-3", "traumatic": "-3", "trust": "2", "trustworthy": "2", "truthful": "2",
    "ugly": "-2", "unfair": "-2", "unfortunately": "-2", "unhappy": "-2", "unnecessary": "-1", "unstable": "-2", "upset": "-2", "useful": "2", "useless": "-2",
    "vicious": "-3", "victimize": "-2", "villain": "-2", "violent": "-3", "violence": "-3", "vulnerable": "-2",
    "warm": "2", "waste": "-2", "weak": "-1", "wicked": "-3", "win": "2", "wisdom": "2", "wonderful": "4", "worry": "-2", "worthless": "-3", "wrong": "-2",
    "yell": "-2", "yelling": "-2",
    "zealous": "2", "genuine": "2", "best": "3", "worst": "-3", "great": "3", "good": "2", "ok": "1", "okay": "1", "fine": "1", "poor": "-2", "terrible": "-3", "excellent": "3", "amazing": "4", "awesome": "4", "fantastic": "4", "wow": "3", "lol": "1", "haha": "1", "meh": "-1", "ugh": "-2", "yay": "3", "nope": "-1", "nah": "-1", "yeah": "1", "yes": "1", "no": "-1"
};

const INTENSIFIERS = {
    "very": 1.5, "extremely": 2.0, "incredibly": 2.0, "really": 1.4,
    "absolutely": 2.0, "totally": 1.5, "utterly": 1.8, "completely": 1.6,
    "super": 1.5, "so": 1.3, "quite": 1.2, "pretty": 1.1, "rather": 1.1,
    "barely": 0.5, "hardly": 0.5, "not": -1, "never": -1, "no": -0.8
};

const NEGATIONS = new Set(["not", "never", "no", "cannot", "can't", "won't", "don't", "doesn't", "didn't", "isn't", "aren't", "wasn't", "weren't", "neither", "nor", "without"]);

export function analyzeComment(text) {
    if (!text || typeof text !== 'string') return { score: 0, label: 'neutral', positive: 0, negative: 0 };

    const original = text;
    const lower = text.toLowerCase().replace(/[^a-z0-9'\s]/g, ' ');
    const words = lower.split(/\s+/).filter(Boolean);

    let totalScore = 0;
    let wordCount = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const baseScore = AFINN[word];
        if (baseScore === undefined) continue;

        let score = parseInt(baseScore);
        let multiplier = 1;
        for (let j = Math.max(0, i - 3); j < i; j++) {
            if (NEGATIONS.has(words[j])) {
                multiplier *= -0.8;
                break;
            }
        }
        if (i > 0 && INTENSIFIERS[words[i - 1]]) {
            const intVal = INTENSIFIERS[words[i - 1]];
            if (intVal > 0) multiplier *= intVal;
            else multiplier *= Math.abs(intVal);
        }
        const originalWord = original.split(/\s+/)[i] || '';
        if (originalWord === originalWord.toUpperCase() && originalWord.length > 2) {
            multiplier *= 1.3;
        }

        totalScore += score * multiplier;
        wordCount++;
    }
    const emojiScores = {
        '😀': 3, '😃': 3, '😄': 3, '😁': 3, '😆': 2, '😅': 1, '🤣': 2, '😂': 2,
        '🙂': 1, '🙃': 0, '😉': 1, '😊': 2, '😇': 2, '🥰': 4, '😍': 4, '🤩': 3,
        '😘': 3, '😗': 1, '😚': 2, '😙': 2, '🥲': -1, '😋': 2, '😛': 1, '😜': 1,
        '🤪': 1, '😝': 1, '🤑': 1, '🤗': 2, '🤭': 1, '🤫': 0, '🤔': 0,
        '🤐': 0, '🤨': -1, '😐': 0, '😑': -1, '😶': 0, '😏': 0, '😒': -2,
        '🙄': -2, '😬': -1, '🤥': -2, '😔': -2, '😪': -2, '🤤': 1, '😴': -1,
        '😷': -2, '🤒': -2, '🤕': -2, '🤢': -3, '🤮': -3, '🤧': -2, '🥵': -2,
        '🥶': -2, '🥴': -1, '😵': -2, '🤯': -1, '🤠': 1, '🥳': 3, '😎': 2,
        '🤓': 1, '🧐': 0, '😕': -2, '😟': -2, '🙁': -2, '☹️': -2, '😮': 0,
        '😯': 0, '😲': 0, '😳': -1, '🥺': -1, '😦': -2, '😧': -2, '😨': -3,
        '😰': -3, '😥': -2, '😢': -3, '😭': -3, '😱': -3, '😖': -3, '😣': -2,
        '😞': -2, '😓': -2, '😩': -2, '😫': -3, '🥱': -1,
        '😤': -2, '😡': -4, '🤬': -4, '😠': -3, '🖕': -4,
        '❤️': 3, '🧡': 2, '💛': 2, '💚': 2, '💙': 2, '💜': 2, '🖤': 1, '🤍': 2,
        '💔': -3, '💕': 3, '💞': 3, '💓': 3, '💗': 3, '💖': 4, '💘': 3, '💝': 3,
        '👍': 2, '👎': -2, '👏': 3, '🙌': 3, '👋': 1, '🤝': 2, '🙏': 2,
        '⭐': 2, '🌟': 3, '✨': 2, '🔥': 2, '💯': 3, '✅': 2, '❌': -2, '⚠️': -1,
        '🚀': 2, '🎉': 3, '🎊': 3, '🎁': 2, '🏆': 3, '🥇': 3,
        '😈': -2, '👿': -3, '💀': -2, '☠️': -2, '😺': 2, '😹': 2,
        '🤙': 1, '💪': 2, '🙏': 2, '🤞': 1, '✌️': 2
    };

    for (const [emoji, score] of Object.entries(emojiScores)) {
        const count = (text.split(emoji).length - 1);
        if (count > 0) {
            totalScore += score * Math.min(count, 3);
            wordCount += count;
        }
    }
    const normalizer = Math.max(wordCount, 1);
    const rawNorm = totalScore / normalizer;
    const compound = Math.max(-1, Math.min(1, rawNorm / 5));

    let label = 'neutral';
    if (compound >= 0.05) label = 'positive';
    else if (compound <= -0.05) label = 'negative';

    return {
        score: parseFloat(compound.toFixed(4)),
        label,
        positive: label === 'positive' ? compound : 0,
        negative: label === 'negative' ? -compound : 0
    };
}

export function getTopWords(comments) {
    const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'this', 'that', 'these', 'those', 'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'his', 'she', 'her', 'they', 'their', 'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too', 'very', 'just', 'because', 'as', 'until', 'while', 'about', 'against', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'then', 'once', 'here', 'there', 's', 't', 're', 've', 'll', 'd', 'm']);

    const freq = {};
    for (const c of comments) {
        const words = (c.text || '').toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/);
        for (const w of words) {
            if (w.length > 2 && !stopwords.has(w)) {
                freq[w] = (freq[w] || 0) + 1;
            }
        }
    }
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 40)
        .map(([word, count]) => ({ word, count }));
}
