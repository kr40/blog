---
title: "Understanding Buffer Overflows: A Beginner's Guide"
date: "2025-04-22"
author: "k4rt1k"
type: "tutorial"
category: "Exploitation"
tags: ["security", "exploitation", "tutorial"]
slug: "buffer-overflow-guide"
---

Buffer overflows have been a persistent vulnerability class for decades. Understanding how they work is fundamental for both defensive programming and penetration testing<!-- more -->

Let's look at a simple C example susceptible to a buffer overflow:

```c
#include <stdio.h>
#include <string.h>

void vulnerable_function(char *input) {
    char buffer[64]; // Fixed size buffer
    strcpy(buffer, input); // No size check!
    printf("Input received: %s\n", buffer);
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Usage: %s <input_string>\n", argv[0]);
        return 1;
    }
    vulnerable_function(argv[1]);
    return 0;
}
```

If the input string provided via `argv[1]` is longer than 63 characters (plus the null terminator), `strcpy` will write past the end of `buffer`, potentially overwriting other important data on the stack, like the return address.
