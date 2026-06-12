import styled from "styled-components";

function Loading({ message = "데이터를 불러오는 중입니다." }) {
    return (
        <LoadingContainer role="status" aria-live="polite">
            <Spinner aria-hidden="true" />
            <LoadingText>{message}</LoadingText>
        </LoadingContainer>
    );
}

export default Loading;

const LoadingContainer = styled.div`
    width: 100%;
    min-height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    color: #cbd5e1;
`;

const Spinner = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 3px solid rgba(148, 163, 184, 0.24);
    border-top-color: #60a5fa;
    animation: spin 0.85s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const LoadingText = styled.p`
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
`;
