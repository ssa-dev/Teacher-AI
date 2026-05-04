import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

app.post("/generate-lesson", async (req, res) => {
  try {
    const { topic, level, lang, duration } = req.body;

    const intro = Math.round(duration * 0.10);
    const explain = Math.round(duration * 0.80);
    const activity = Math.round(duration * 0.05);
    const questions = Math.round(duration * 0.05);

    const prompt = `
أنت مساعد معلم محترف.

أنشئ درسًا كاملًا وفق البيانات التالية:

موضوع الدرس: ${topic}
مستوى الطلاب: ${level}
لغة الدرس: ${lang}
مدة الدرس: ${duration} دقيقة

التقسيم الزمني للاسترشاد فقط، ولا تكتبه داخل الدرس:
- التمهيد: ${intro} دقيقة
- الشرح: ${explain} دقيقة
- النشاط: ${activity} دقيقة
- الأسئلة: ${questions} دقيقة

المطلوب:
1. اكتب الدرس كمحتوى مباشر للطالب.
2. لا تكتب توقيتات داخل الدرس.
3. لا تكتب عبارات مثل: "اطلب من الطلاب" أو "يناقش المعلم".
4. اجعل النشاط بعنوان: "نشاط" فقط.
5. لا تستخدم Mermaid نهائيًا.
6. لا تكتب عناوين مثل: "خريطة ذهنية" أو "المخططات المطلوبة".
7. ضع خريطة ذهنية واحدة فقط بعد شرح المفهوم الأساسي مباشرة.
8. أنشئ الخريطة الذهنية باستخدام HTML مباشر فقط.

قواعد الخريطة الذهنية:
- مركز الخريطة يكون موضوع الدرس نفسه.
- الخريطة تكون هرمية متفرعة.
- استخدم من 3 إلى 5 فروع رئيسية.
- تحت كل فرع رئيسي من 2 إلى 5 أوراق فرعية.
- لا تجعل الفروع أسماء أقسام عامة مثل: تعريف، أنواع، أهمية، أمثلة، نشاط.
- اجعل الفروع مفاهيم حقيقية من موضوع الدرس.
- استخدم هذه الأصناف فقط:
mindmap
mindmap-center
mindmap-tree
mindmap-node
mindmap-branch-title
mindmap-leaf

مثال لشكل الخريطة المطلوب:
<div class="mindmap">
  <div class="mindmap-center">الحاسب الآلي</div>
  <div class="mindmap-tree">
    <div class="mindmap-node">
      <div class="mindmap-branch-title">كيف يعمل؟</div>
      <div class="mindmap-leaf">بيانات</div>
      <div class="mindmap-leaf">معالجة</div>
      <div class="mindmap-leaf">نتائج ومعلومات</div>
    </div>
    <div class="mindmap-node">
      <div class="mindmap-branch-title">المكونات المادية</div>
      <div class="mindmap-leaf">فأرة</div>
      <div class="mindmap-leaf">شاشة</div>
      <div class="mindmap-leaf">صندوق الحاسب</div>
      <div class="mindmap-leaf">لوحة مفاتيح</div>
    </div>
    <div class="mindmap-node">
      <div class="mindmap-branch-title">المكونات البرمجية</div>
      <div class="mindmap-leaf">نظام تشغيل</div>
      <div class="mindmap-leaf">برامج المستخدم</div>
    </div>
  </div>
</div>

تعليمات مهمة جدًا:
- اكتب الخريطة كـ HTML مباشر داخل المحتوى.
- لا تضع الخريطة داخل علامات كود.
- لا تكتب الوسوم كنص.
- لا تستخدم علامات الاقتباس المعكوسة.
- لا تستخدم الرمز الذي يتكون من ثلاث علامات backtick نهائيًا.
- يجب أن يبدأ كود الخريطة مباشرة بهذا السطر:
<div class="mindmap">
- ويجب أن ينتهي بإغلاق div كامل.

9. أضف أمثلة حياتية.
10. أضف نشاطًا مباشرًا للطالب.
11. أضف أسئلة تقييم.
12. أضف خلاصة قصيرة.
13. لا تستخدم أزرارًا أو عناصر تفاعلية لأن المحتوى سيُصدّر PDF.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    res.json({ lesson: response.output_text });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    res.status(500).json({
      error: error.message || "حدث خطأ أثناء إنشاء الدرس"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});