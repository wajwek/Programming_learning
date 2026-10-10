def find_increasing_subsequences(tab):
    result = []
    tmp = []
    for i in range(1, len(tab)):
        if tab[i - 1] < tab[i]:
            tmp.append(tab[i - 1])
        else:
            if len(tmp) + 1 > 1:
                tmp.append(tab[i - 1])
                result.append(tuple(tmp))
            tmp = []
    if len(tmp) + 1 > 1:
            tmp.append(tab[len(tab) - 1])
            result.append(tuple(tmp))
    return result

print(find_increasing_subsequences([1, 1, 1, 2, 66, 77]))
