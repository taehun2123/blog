import React from 'react';
import { Helmet } from 'react-helmet';

const siteUrl = "https://taehun2123.github.io/blog/";
const ogImage = `${siteUrl}devh_icon.png`;

const MetaData = ({ children }) => {
  return (
    <div>
      <Helmet>
        <html lang="ko" />
        <title>DEVTH SPACE</title>
        <link rel="canonical" href={siteUrl} />
        <meta name="description" content="24살 풀스택 개발자가 되고싶은 김태훈의 개인 블로그 입니다." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="DEVTH SPACE" />
        <meta property="og:description" content="24살 풀스택 개발자가 되고싶은 김태훈의 개인 블로그 입니다." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="DEVTH SPACE" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="DEVTH SPACE" />
        <meta name="twitter:description" content="24살 풀스택 개발자가 되고싶은 김태훈의 개인 블로그 입니다." />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      {children}
    </div>
  );
};

export default MetaData;
