import requests
import pandas as pd
import time
import os

def get_lotto_numbers(start_drw, end_drw):
    filename = "lotto_results.csv"
    
    for i in range(start_drw, end_drw + 1):
        url = f"https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo={i}"
        
        try:
            response = requests.get(url)
            data = response.json()
            
            if data.get("returnValue") == "success":
                draw_info = {
                    "회차": data["drwNo"],
                    "추첨일": data["drwNoDate"],
                    "번호1": data["drwtNo1"],
                    "번호2": data["drwtNo2"],
                    "번호3": data["drwtNo3"],
                    "번호4": data["drwtNo4"],
                    "번호5": data["drwtNo5"],
                    "번호6": data["drwtNo6"],
                    "보너스": data["bnusNo"],
                    "1등당첨금": data["firstWinamnt"],
                    "1등당첨인원": data["firstPrzwnerCo"]
                }
                
                # 데이터프레임 생성
                df = pd.DataFrame([draw_info])
                
                # 파일이 없으면 새로 만들고, 있으면 이어서 저장 (append)
                if not os.path.exists(filename):
                    df.to_csv(filename, index=False, encoding="utf-8-sig")
                else:
                    df.to_csv(filename, mode='a', header=False, index=False, encoding="utf-8-sig")
                
                print(f"{i}회차 데이터를 저장했습니다.")
            else:
                print(f"{i}회차 데이터가 없습니다. 종료합니다.")
                break
                
            # 서버 부하 방지 (0.1초 대기)
            time.sleep(0.1)
            
        except Exception as e:
            print(f"{i}회차 호출 중 오류 발생: {e}")
            break

if __name__ == "__main__":
    latest_draw = 1120 
    print(f"로또 데이터 수집을 시작합니다 (1회 ~ {latest_draw}회)...")
    
    # 기존 파일이 있다면 삭제하고 새로 시작
    if os.path.exists("lotto_results.csv"):
        os.remove("lotto_results.csv")
        
    get_lotto_numbers(1, latest_draw)
    print("\n데이터 수집 및 저장이 완료되었습니다.")
