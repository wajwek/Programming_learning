import pickle

def save_data_pickle(data, filename):
    with open(filename, 'wb') as file:
        pickle.dump(data, file, protocol=pickle.HIGHEST_PROTOCOL)

def load_data_pickle(filename):
    with open(filename, 'rb') as file:
        return pickle.load(file)

data = {"name": "Maciej", "list": [1, 2, 3]}
save_data_pickle(data, "data.pkl")

loaded_data = load_data_pickle("data.pkl")
print(loaded_data)
