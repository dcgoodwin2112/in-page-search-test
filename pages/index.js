import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRef, useState, useEffect } from "react";
import { getIndexMarkdown } from "../lib/util.js";

export default function Home({ markdown }) {
  const contentRef = useRef(null);

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] = useState(null);

  const [searchIndex, setSearchIndex] = useState(-1);

  const [searchHistory, setSearchHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add current search to history
    // Set() forces unique
    setSearchHistory([...new Set([...searchHistory, search])]);

    // Reset search index
    setSearchIndex(-1)

    contentRef.current.innerHTML = markdown.replaceAll(
      search,
      `<span class="search-result">${search}</span>`
    );
  };

  useEffect(() => {
    const results = contentRef.current.querySelectorAll(".search-result");
    if (results) {
      setSearchResults(results);
    }
  }, [contentRef, searchHistory]);

  const handleClick = (e) => {
    const results = Array.from(searchResults);
    const curIndex = searchIndex;
    switch (e.target.name) {
      case "prev":
        if (curIndex < 0) return;
        if (results[searchIndex]) {
          results[searchIndex].classList.toggle("search-result-active");
        }
        if (results[searchIndex - 1]) {
          results[searchIndex - 1].scrollIntoView();
          results[searchIndex - 1].classList.toggle("search-result-active");
        }
        setSearchIndex(searchIndex - 1);
        break;
      case "next":
        if (searchIndex >= results.length) return;
        if (results[searchIndex]) {
          results[searchIndex].classList.toggle("search-result-active");
        }
        if (results[searchIndex + 1]) {
          results[searchIndex + 1].scrollIntoView();
          results[searchIndex + 1].classList.toggle("search-result-active");
        }
        setSearchIndex(searchIndex + 1);
        break;
      default:
        console.log(`This state shouldn't be reachable...`);
    }
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div
      className={styles.container}
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className="search">
          <div style={{ position: "fixed", top: "5rem", left: "5rem" }}>
            <p>Enter search term:</p>
            <form onSubmit={handleSubmit}>
              <input
                onChange={handleChange}
                type="text"
                name="search"
                value={search}
              />
              <input type="submit" value="Search" />
            </form>
            {searchResults?.length > 0 ? (
              <>
                <h3>Search Results Nav</h3>
                {console.log(searchResults)}
                <div>
                  <button name="prev" onClick={handleClick}>
                    Prev
                  </button>
                  <button name="next" onClick={handleClick}>
                    Next
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
            {searchHistory?.length > 0 ? (
              <>
                <h3>Previous Searches</h3>
                {searchHistory.map((search) => {
                  return <p key={search}>{search}</p>;
                })}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div
          ref={contentRef}
          className="content-area"
          dangerouslySetInnerHTML={{ __html: markdown }}
        ></div>
      </main>

      <footer className={styles.footer}>Footer content here...</footer>
    </div>
  );
}

export async function getStaticProps() {
  const markdown = await getIndexMarkdown();
  return {
    props: { markdown },
  };
}
