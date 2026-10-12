#include <stdio.h>
#include <unistd.h>

int main () {
    printf("I am child process 1\n");
    sleep(20);
    printf("Child process 1 is exiting\n");
    return 0;
}
