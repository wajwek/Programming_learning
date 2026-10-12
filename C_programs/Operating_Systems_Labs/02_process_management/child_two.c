#include <stdio.h>
#include <unistd.h>

int main () {
    printf("I am child process 2\n");
    sleep(30);
    printf("Child process 2 is exiting\n");
    return 0;
}
