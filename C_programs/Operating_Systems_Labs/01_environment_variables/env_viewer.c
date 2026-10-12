#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[], char *envp[]){
    if (argc == 1) {
        for (char **env = envp; *env != NULL; env++){
            printf("%s\n", *env);
        }
    }
    else {
        for (int i = 1; i < argc; i++){
            char* env = getenv(argv[i]);
            if (env != NULL) { 
                printf("%s\n", env);
            }
            else {
                printf("Error: Environment variable not found for argument: %s\n", argv[i]);
            }    
        }
    }
}
