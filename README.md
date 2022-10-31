2022-10-31일자 작성중 삭제된 문제로 간략히 재작성함

# Spec.
- python version : 3.7.3
- flask version : 2.2.2

# Purpose.
- 검사 모델 업데이트 및 실시간 렌더링 컨트롤 목적의 웹서버

# ENV 관리.
- python-dotenv 를 통한 환경변수 컨트롤 (FLASK_ENV, FLASK_SET)
- config 폴더 및 config.py 파일을 통한 중요 환경변수 은닉화
**해당 파일은 로컬에 별도 백업을 해두니 담당자에게 문의

# requirements.txt 관리
```bash
python -m venv [환경변수파일명] *보통은 venv로 기입
```

```bash
pip install -r requirements.txt 
```
