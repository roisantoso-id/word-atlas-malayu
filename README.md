# JomBelajar · 马来语高频词

给中文母语者的马来语背单词网页：按词频排好的 2,957 个马来语常用词，每个词有马来语真人发音、中文释义和例句，用 FSRS 间隔重复安排复习。不用注册，进度存在自己的设备上。

## 和原版的区别

界面和学习流程改编自开源项目 [词光 Word Atlas](https://github.com/designfuchen/word-atlas)（代码 MIT），原版说明保留在 [README.word-atlas.md](README.word-atlas.md)。

- **词表**：换成 JomBelajar 马来语 5000 高频词（启航整理、马来语专业团队审核），先上架已审核的 2,957 个。
- **发音**：一种马来语录音，放在腾讯云 COS 新加坡；没有英式 / 美式切换，没有音标。设备朗读用 `ms-MY`。
- **分级**：T1–T6 按词频每 500 词一段；分组按词性（名词、动词、形容词、副词、功能词、专有名词）。
- **插画**：暂时没有，词卡显示文字版面。原版的英语插画、英语音频和雅思话题图都已删除。
- **补句、高亮**：按马来语词缀匹配（me-/ber-/di-/ter-/pe-/ke-/se-，-kan/-an/-i/-nya，叠词）。

## 本地运行

```bash
npm install
npm run dev        # http://localhost:5188
npm test
npm run build
```

重新生成词库：`python3 scripts/malay/build_malay_atlas.py`（默认读 `../cuc-bahasa-malay/content/vocab5000/words.json`）。

## 授权

代码 MIT（见 LICENSE，保留原作者版权声明）。马来语词表和例句归 JomBelajar 团队所有。
