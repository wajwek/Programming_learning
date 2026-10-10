def load_data(path):
    try:
        with open(path, 'r') as f:
            content = f.read().split()
            n = int(content[0])
            matrix_a = []
            matrix_b = []
            counter = 1
            for x in range(2):
                matrix = []
                for i in range(n):
                    row = []
                    for j in range(n):
                        row.append(int(content[counter]))
                        counter += 1
                    matrix.append(row)
                if x == 0:
                    matrix_a = matrix
                else:
                    matrix_b = matrix
        return n, matrix_a, matrix_b
    except FileNotFoundError:
        return None, None, None
    
def add_matrices(A, B, n):
    C = []
    for i in range(n):
        row = []
        for j in range(n):
            total = A[i][j] + B[i][j]
            row.append(total)
        C.append(row)
    return C

def multiply_matrices(A, B, n):
    C = [[0]*n for x in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]
    return C

def save_matrix(file_path, matrix, message):
    with open(file_path, 'a') as file:
        all_numbers = [str(x) for row in matrix for x in row]
        width = len(max(all_numbers, key=len)) + 1 
        file.write(f"--------------- {message} ----------------\n")
        for row in matrix:
            line = ""
            for number in row:
                line += f"{number:>{width}}"
            file.write(line + "\n")
    file.close()

def process_matrices(input_file, output_file):
    data = load_data(input_file)
    n, A, B = data

    sum_matrix = add_matrices(A, B, n)
    product_matrix = multiply_matrices(A, B, n)

    with open(output_file, 'w') as f:
        save_matrix("result.txt", A, "Matrix A")
        save_matrix("result.txt", B, "Matrix B")
        save_matrix("result.txt", sum_matrix, "Sum A+B")
        save_matrix("result.txt", product_matrix, "Product A*B")

with open("result.txt", 'w') as plik:
    plik.close()
process_matrices('data.txt', 'result.txt')
