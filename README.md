# celebs-in-my-terminal 🎩

Claude Code 입력창 위에 8비트 친구가 한 명씩 나와서 말을 거는 모드.

질문할 때마다 친구 한 명이 랜덤으로 나온다. 처음엔 예시 친구들(CLAUDE, MUSK, JOBS, KANYE, VIRGIL, FUJIWARA)이 나오고, `/crew add`로 원하는 인물을 넣으면 그 친구들만 나온다.
평소엔 평소 대사를, Claude가 답변을 쓰는 동안엔 작업 중 대사를 말풍선으로 띄운다.

## 설치

Claude Code 터미널 입력창에서:

```
/plugin install hat-clawd --marketplace textsoap-spread/celebs-in-my-terminal
```

`Add marketplace?`가 뜨면 `y`, 그다음 설치 범위를 고르고 Enter.

셸에서:

```
claude plugin install hat-clawd --marketplace textsoap-spread/celebs-in-my-terminal
```

데스크톱 앱에서는 `/plugin`이 안 되니까: 입력창 옆 + → Plugins → Add marketplace에 `textsoap-spread/celebs-in-my-terminal` → Add plugin.

## 쓰는 법

- 질문할 때마다 다른 친구가 나온다.
- `/pixel` 을 치면 그림이 16x16 ↔ 8x8 로 바뀐다.

### 내 친구 고르기

```
/crew                 지금 나오는 친구 보기
/crew add 아이유       친구 넣기 (AI가 도트 그림과 대사를 만들어준다, 30초쯤)
/crew add jobs        예시 친구 이름이면 그대로 데려온다
/crew remove 아이유    친구 빼기
/crew reset           내 친구 다 지우고 예시 친구로 돌아가기
```

내 친구가 한 명이라도 있으면 예시 친구는 안 나온다. 고른 친구는 세션을 다시 켜도 남아 있다.
- 창이 너무 낮으면 알아서 숨는다.

## 참고

예시 등장인물은 실존 인물을 장난스럽게 그린 패러디 픽셀 아트이고, 대사도 대부분 지어낸 농담이다.
