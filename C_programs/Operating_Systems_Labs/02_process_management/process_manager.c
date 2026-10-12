#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    printf("Creating child processes...\n");

    int child_1;
    if ((child_1 = fork()) == 0) {
        execl("child_one", "child_one", NULL);
    }
    
    int child_2;
    if ((child_2 = fork()) == 0) {
        execl("child_two", "child_two", NULL);
    }
    int status;
    pid_t wpid;

    while ((wpid = wait(&status)) > 0) {
        printf("-------------------\n");
        printf("Child process with PID %d has finished\n", wpid);
        if (WIFEXITED(status)) {
            printf("Exit code: %d\n", WIFEXITED(status));
        }
        else if (WIFSIGNALED(status)) {
            printf("Termination signal: %d\n", WIFSIGNALED(status));
        }
        printf("Program termination step\n");
        return 0;
    }
}
