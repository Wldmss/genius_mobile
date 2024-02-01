# 지니어스 모바일

## 환경 구성

-   node v16.20.1
    -   https://nodejs.org/en/blog/release/v16.20.1
-   expo-cli
-   prettier, eslint 설정
    -   Prettier ESLint, Prettier - Code formatter 설치 (vsCode extensions)
    -   vsCode Settings > Editor:Format on Save 체크, Editor:Default Formatter - Prettier ESLint 설정
-   babel 절대경로
    -   babel.config.js 참고

## expo 환경 설정

1. expo 회원 가입

    - expo.dev
    - 개인 계정 생성

2. expo 로그인
    - npx expo login (PC terminal에서 실행)
    - 개발 환경 (PC) 에서 로그인, expo 앱에서 로그인 시 연동됨

## 프로젝트 실행

1.  원하는 명령어로 프로젝트 실행

    -   npx expo start
    -   npm start

2.  device 설정
    -   web : webview 지원이 안됨
    -   android, ios expo go APP
        -   PC와 mobile이 같은 네트워크에 접속되어 있어야 함
        -   앱스토어에서 다운로드 -> QR 또는 링크를 통해 접속
        -   android : Expo
        -   ios : Expo Go
    -   mobile USB 연결

## 이슈

    - expo-cli를 통해 만들어졌지만 추가 기능에 따라 react native cli로 변경 가능성 있음 => eject 참고
