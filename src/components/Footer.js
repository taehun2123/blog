import styled from "styled-components";

const GITHUB_URL = "https://github.com/taehun2123";
const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <FooterContainer>
      <FooterInner>
        <FooterBrand>
          <strong>DEVTH SPACE</strong>
          <span>Copyright © {currentYear} DEVTH. All rights reserved.</span>
        </FooterBrand>
        <GithubLink
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="DEVTH GitHub로 이동"
        >
          <i className="fab fa-github" aria-hidden="true" />
          <span>GitHub</span>
        </GithubLink>
      </FooterInner>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  position: relative;
  z-index: 2;
  width: 100%;
  height: auto;
  min-height: 180px;
  margin-top: 10vh;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
  background:
    radial-gradient(circle at 50% 0%, rgba(96, 165, 250, 0.1), transparent 34%),
    rgba(2, 6, 23, 0.54);
  backdrop-filter: blur(12px);
  box-sizing: border-box;
`;

const FooterInner = styled.div`
  width: min(1100px, calc(100% - 2em));
  min-height: 180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5em;
  box-sizing: border-box;

  @media (max-width: 640px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55em;

  strong {
    color: #f8fafc;
    font-size: 18px;
    font-weight: 900;
  }

  span {
    color: #94a3b8;
    font-size: 13px;
    font-weight: 700;
  }
`;

const GithubLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  min-width: 132px;
  min-height: 44px;
  padding: 0 1em;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.58);
  color: #e5e7eb;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 16px 34px rgba(2, 6, 23, 0.25);
  font-size: 14px;
  font-weight: 900;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  i {
    font-size: 22px;
  }

  &:hover {
    border-color: rgba(147, 197, 253, 0.48);
    background: rgba(30, 41, 59, 0.76);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid #93c5fd;
    outline-offset: 4px;
  }
`;
