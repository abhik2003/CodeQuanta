def test():
    n = int(input())
    a = list(map(int,input().split()))
    ans =[ i*i for i in a]

    with open('output.txt', 'r') as file:
        lines = file.readlines()
        non_blank_lines = [line.split() for line in lines if line.strip()]

    if len(non_blank_lines)!=1:
        print("WA1")
        return
    else:
        try:
            for i in range(len(ans)):
                if ans[i]!=int(non_blank_lines[0][i]):
                    print("WA2")
                    return
            print("Accepted")
        except Exception as e:
            print("WA3")
            return
    
if __name__ == "__main__":
    test()

