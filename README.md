# hlf_kisa

### Asset항목

ViewData: 시청 데이터. ID값은 V-sid[0:4]-timestamp 형태로 매번 수집될 때마다 다름.
asset ViewData identified by dataId{
  o String dataId
  o String uid // 개인식별정보
  o String sid // 세션 데이터
  o Boolean gender // True는 man, False는 Woman
  o Integer age //나이
  o String url // 페이지 url
  o String referer optional // 유입경로
  o Integer width
  o Integer height
  o DateTime timestamp // 데이터 수집 당시의 시간
  o String title // 프로그램명
  o String channel // 채널명
  o Double duration // 전체 길이
  o Double uptime // 현재 영상 시간
}


EventData: ViewData와 동일한 항목값. ID값은 E-sid[0:4]-timestamp 형태로 매번 수집될 때마다 다름.

asset EventData identified by eventId{
  o String eventId
  o String uid // 개인식별정보
  o String sid // 세션 데이터
  o Boolean gender // True는 man, False는 Woman
  o Integer age //나이
  o String url // 페이지 url
  o String referer // 유입경로
  o Integer width
  o Integer height
  o DateTime timestamp // 데이터 수집 당시의 시간
  o String title // 프로그램명
  o String channel // 채널명
  o Double duration // 전체 길이
  o Double uptime // 현재 영상 시간
  o action action optional
  o label label optional
}

+ enum 형태로 action과 label 정의.

enum action {
  o FOCUS
  o BLUR
  o AD
}
enum label{
  o VOLUMNUP
  o GETBACK
  o VOLUMNDOWN
  o GETOUT
  o ADCLICK
  o ADCLOSE
}


### Participant 항목

participant User identified by sid{
  o String sid
  o String uid // 개인식별정보
  o Boolean gender // True는 man, False는 Woman
  o Integer age //나이
  o String[] url // 페이지 url
  o String referer optional // 유입경로
  
  o DateTime timestamp // 데이터 수집 당시의 시간
  o String[] titles
  o String[] channels
}

User - 세션을 ID값으로 갖는 항목.

ViewDataCreate라는 txn을 통해 ViewDataCreate를 생성할 때 자동으로 만들어진다.

사용자가 다른 영상으로 이동할 경우를 대비해 url, titles, channels은 배열 형태이며, 새로운 값이 들어갈 경우 업데이트

(예컨대 MBC에서 무한도전 보다가 복면가왕으로 넘어간다고 하면 titles에는 [무한도전, 복면가왕]으로 업데이트, channel은 [MBC]그대로. SBS 아빠어디가로 넘어갈 경우 titles에는 [무한도전, 복면가왕, 아빠어디가]로 업데이트, channel은 [MBC, SBS]. url도 마찬가지로 계속 업데이트된다.)


## Query

시청률 데이터 / User 데이터 등을 가져오기 위해 필요한 쿼리.

현재 composer가 제공하는 query에는 aggregation 기능을 제공하지 않는 상황. query로 가져온 array를 프론트 레벨에서 가공해 써야 하는 상태다. 예컨대 gender가 남성 / 여성인 값을 불러오는 query를 만들 수는 있지만, 결과로 나온 array의 length를 계산하는 건 불가능하다.

파이썬 플라스크를 사용해서 작업 중이라면, 
데이터 받은 다음 처리작업을 수행할 파이썬 코드 만들어서 보내줄 수 있음.

- 해당 프로그램의 남성 / 여성 시청자
- 해당 프로그램의 성별 + 연령별 groupby 시청자 수 top5
- 정주행율 / 이탈율 수치 제작방법은 고민중.