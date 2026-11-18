import { ArrowUpRight, Database, Github, Heart } from "lucide-react";
import { useAtlas } from "../atlas/context";
import { REPO_URL } from "../config";

const BASE = import.meta.env.BASE_URL;

export function About() {
  const atlas = useAtlas();
  return (
    <div className="page about">
      <header className="about-hero">
        <img src={`${BASE}brand/og.webp`} alt="" />
        <div>
          <p className="eyebrow">关于 JomBelajar</p>
          <h1 className="display">一词一声，学会马来语。</h1>
          <p className="lede">
            JomBelajar 把马来语最常用的 {atlas.count.toLocaleString()} 个词按出现频率排好，每个词配马来语真人发音、中文释义和例句。学会一个，就在你的星图上点亮一颗星。
          </p>
          <p className="lede">它免费、无需注册，进度只存在你自己的设备上。</p>
          <div className="about-actions">
            <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
              <Github size={18} /> 在 GitHub 上查看
            </a>
            <a className="btn btn-ghost" href={`${REPO_URL}/tree/main/data`} target="_blank" rel="noreferrer">
              <Database size={18} /> 下载词库 JSON / CSV
            </a>
          </div>
        </div>
      </header>

      <div className="about-grid">
        <section className="panel">
          <h3 className="eyebrow">为什么记得住</h3>
          <ul className="feature-list">
            <li>
              <b>先听见。</b>每个词都有马来语真人录音，先听再记。
            </li>
            <li>
              <b>再想起。</b>选义、补句、听音辨词、拼写，从认得走到会写。马来语拼写和读音一一对应，听会了就能写出来。
            </li>
            <li>
              <b>刚好在快忘时重逢。</b>FSRS 是新版 Anki 用的开源记忆算法，只在你快要遗忘时安排复习。
            </li>
            <li>
              <b>分数诚实。</b>只算第一次作答。答错的词会换个题型再见一面，但不会抬高正确率。
            </li>
            <li>
              <b>进度只属于你。</b>没有账号，没有服务器，数据存在你的浏览器里，随时能导出。
            </li>
          </ul>
        </section>

        <section className="panel">
          <h3 className="eyebrow">快捷键</h3>
          <dl className="keys">
            <div>
              <dt>
                <kbd>⌘</kbd>
                <kbd>K</kbd> 或 <kbd>/</kbd>
              </dt>
              <dd>搜索任何词</dd>
            </div>
            <div>
              <dt>
                <kbd>1</kbd>–<kbd>4</kbd>
              </dt>
              <dd>选择答案</dd>
            </div>
            <div>
              <dt>
                <kbd>Enter</kbd>
              </dt>
              <dd>确认 / 继续</dd>
            </div>
            <div>
              <dt>
                <kbd>←</kbd> <kbd>→</kbd>
              </dt>
              <dd>词卡里切换上一个、下一个</dd>
            </div>
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>关闭弹窗</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <h3 className="eyebrow">内容从哪里来</h3>
          <p className="muted">
            词表按马来语语料里的出现频率排序。中文释义和例句由马来语专业团队整理审核，还没审完的词暂时不上架。看到错的地方，欢迎在 GitHub 提 Issue。
          </p>
          <p className="muted">
            界面和学习流程基于开源项目{" "}
            <a className="link" href="https://github.com/designfuchen/word-atlas" target="_blank" rel="noreferrer">
              词光 Word Atlas
            </a>
            （MIT 许可）改编，感谢原作者。
          </p>
        </section>

        <section className="panel">
          <h3 className="eyebrow">给开发者</h3>
          <p className="muted">
            <code>data/malay-5000.json</code> 和 <code>.csv</code> 是完整词表（含发音地址）；<code>public/atlas</code> 里是网页用的分块数据。<code>scripts/malay/build_malay_atlas.py</code> 从 JomBelajar 词库重新生成。
          </p>
          <a className="link" href={`${REPO_URL}#readme`} target="_blank" rel="noreferrer">
            阅读文档 <ArrowUpRight size={14} />
          </a>
        </section>
      </div>
      <p className="colophon">
        <Heart size={14} /> 做给每一个在背单词的人。
      </p>
    </div>
  );
}
