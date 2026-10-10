def task_1():
    numbers = [x for x in range(1, 21)]
    divisible = [z for z in numbers if z % 3 == 0]
    print(divisible)
    print(sum(divisible))

task_1()
