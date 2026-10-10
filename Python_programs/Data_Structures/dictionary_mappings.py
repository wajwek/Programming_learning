def create_dictionary(text):
    elements = text.split(",")
    result_dict = {}
    for x in elements:
        if x.count(":") != 1:
            print("Invalid data format")
            return False
        key, value = x.split(":")
        result_dict[key] = value
    print(result_dict)

create_dictionary("ab:1,cd:23,qw:q")
