import random
def generate_numbers(n, filename):
    try:
        with open(filename, 'w') as file:
            for i in range(n):
                a = random.randint(1, 1000)
                file.write(str(a) + '\n')
            file.close()
    except Exception as e:
        print("Error", e)
generate_numbers(100, "test.txt")
