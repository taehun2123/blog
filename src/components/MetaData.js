import React from 'react';
import { Helmet } from 'react-helmet';

const ogImage = `${process.env.PUBLIC_URL}/devh_icon.png`;

const MetaData = ({ children }) => {
  return (
    <div>
      <Helmet>
        <meta property="og:title" content="DEVTH" />
        <meta property="og:description" content="24살 풀스택 개발자가 되고싶은 김태훈의 개인 블로그 입니다." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content="https://taehun2123.github.io/blog" />
        <meta property="og:type" content="website" />
      </Helmet>
      {children}
    </div>
  );
};

export default MetaData;
