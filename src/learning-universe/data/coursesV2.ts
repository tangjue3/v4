import type { CourseV2, BloomObjective, CodeExampleV2, FAQItem, KnowledgeCrossRef } from '../types'

export const coursesV2: CourseV2[] = [
  {
    id: 1,
    objectives: [
      { level: 'L1-认知', description: '理解C语言的基本语法结构、数据类型、运算符和流程控制语句' },
      { level: 'L2-应用', description: '能够使用指针、数组、函数编写中等复杂度的C程序，掌握动态内存管理' },
      { level: 'L3-综合', description: '综合运用结构体、文件操作和动态内存管理完成小型项目开发' },
    ] as BloomObjective[],
    prerequisiteCourses: [],
    successorCourses: [3, 4, 5, 7, 8, 22],
    codeExamples: [
      {
        id: 'code-c1-1',
        title: '指针与数组',
        description: '演示指针与数组的紧密关系，通过指针遍历数组元素',
        level: '进阶',
        code: `#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d, *(ptr+%d) = %d\\n", i, arr[i], i, *(ptr + i));
    }
    return 0;
}`,
        output: `arr[0] = 10, *(ptr+0) = 10
arr[1] = 20, *(ptr+1) = 20
arr[2] = 30, *(ptr+2) = 30
arr[3] = 40, *(ptr+3) = 40
arr[4] = 50, *(ptr+4) = 50`,
        commonError: '未初始化指针直接解引用导致段错误，或混淆数组名与指针变量的区别',
        language: 'c',
      } as CodeExampleV2,
      {
        id: 'code-c1-2',
        title: '动态内存管理与结构体',
        description: '使用malloc动态分配结构体数组并释放内存',
        level: '进阶',
        code: `#include <stdio.h>
#include <stdlib.h>
typedef struct {
    char name[20];
    int score;
} Student;
int main() {
    int n = 3;
    Student *students = (Student *)malloc(n * sizeof(Student));
    if (!students) { printf("内存分配失败\\n"); return 1; }
    for (int i = 0; i < n; i++) {
        sprintf(students[i].name, "学生%d", i + 1);
        students[i].score = 80 + i * 5;
    }
    for (int i = 0; i < n; i++) {
        printf("%s: %d分\\n", students[i].name, students[i].score);
    }
    free(students);
    return 0;
}`,
        output: `学生1: 80分
学生2: 85分
学生3: 90分`,
        commonError: '忘记检查malloc返回值是否为NULL，或忘记调用free导致内存泄漏',
        language: 'c',
      } as CodeExampleV2,
      {
        id: 'code-c1-3',
        title: '函数指针与回调',
        description: '使用函数指针实现通用的排序回调机制',
        level: '高级',
        code: `#include <stdio.h>
int ascending(int a, int b) { return a - b; }
int descending(int a, int b) { return b - a; }
void bubbleSort(int *arr, int n, int (*compare)(int, int)) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (compare(arr[j], arr[j + 1]) > 0) {
                int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
            }
}
int main() {
    int arr[] = {5, 2, 8, 1, 9};
    int n = 5;
    bubbleSort(arr, n, ascending);
    printf("升序: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    bubbleSort(arr, n, descending);
    printf("\\n降序: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
        output: `升序: 1 2 5 8 9
降序: 9 8 5 2 1`,
        commonError: '函数指针声明语法错误，或回调函数签名与函数指针类型不匹配',
        language: 'c',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c1-1',
        question: '指针和数组有什么区别和联系？',
        answer: '数组名在大多数表达式中会退化为指向首元素的指针，但数组名是常量不能赋值，而指针变量可以重新指向。sizeof对数组返回整个数组大小，对指针返回指针本身大小。',
        difficulty: '基础',
        keyPoints: ['数组名退化为指针', 'sizeof行为不同', '数组名是常量指针'],
        commonMisconceptions: ['认为数组名和指针完全等价', '认为数组总是按值传递'],
        relatedConcepts: ['指针运算', '数组作为函数参数'],
        followUpQuestions: ['什么时候数组名不会退化为指针？', '多维数组如何用指针访问？'],
      } as FAQItem,
      {
        id: 'faq-c1-2',
        question: '什么是野指针？如何避免？',
        answer: '野指针是指向不可预知内存区域的指针，常见于未初始化的指针、已释放内存的指针和超出作用域的指针。避免方法包括：定义时初始化为NULL、释放后置NULL、使用assert检查。',
        difficulty: '基础',
        keyPoints: ['未初始化指针', '悬挂指针', '释放后置NULL'],
        commonMisconceptions: ['认为free后指针自动变为NULL', '认为局部变量自动初始化为0'],
        relatedConcepts: ['内存泄漏', '段错误'],
        followUpQuestions: ['free后的指针不置NULL会有什么后果？', '如何使用Valgrind检测内存问题？'],
      } as FAQItem,
      {
        id: 'faq-c1-3',
        question: 'malloc和calloc有什么区别？',
        answer: 'malloc分配指定字节数的内存，内容未初始化；calloc分配n个指定大小的连续内存块，并将所有位初始化为0。calloc更安全但稍慢，适合需要零初始化的场景。',
        difficulty: '深入',
        keyPoints: ['初始化行为不同', '参数形式不同', '性能差异'],
        commonMisconceptions: ['认为malloc也会初始化为0', '认为calloc不需要检查返回值'],
        relatedConcepts: ['realloc', '内存对齐'],
        followUpQuestions: ['realloc如何处理缩小和扩大？', '为什么calloc比malloc慢？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c1-1', 'lab-c1-2'],
    assessmentIds: ['assess-c1-pre', 'assess-c1-unit'],
    estimatedHours: 40,
  },
  {
    id: 2,
    objectives: [
      { level: 'L1-认知', description: '理解Python的基本语法、数据类型和控制流结构' },
      { level: 'L2-应用', description: '能够使用列表、字典、函数和面向对象编写Python程序' },
      { level: 'L3-综合', description: '综合运用生成器、装饰器、上下文管理器等高级特性设计优雅的Python程序' },
    ] as BloomObjective[],
    prerequisiteCourses: [],
    successorCourses: [3, 12, 16, 17],
    codeExamples: [
      {
        id: 'code-c2-1',
        title: '装饰器与计时',
        description: '使用装饰器实现函数执行时间统计',
        level: '进阶',
        code: `import time
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} 耗时: {time.time() - start:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

print(slow_add(3, 5))`,
        output: `slow_add 耗时: 0.1005s
8`,
        commonError: '忘记使用functools.wraps保留原函数元信息，导致函数名和文档字符串丢失',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c2-2',
        title: '生成器与迭代器',
        description: '使用生成器实现斐波那契数列的惰性求值',
        level: '进阶',
        code: `def fibonacci_gen(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

fib = fibonacci_gen(10)
print(list(fib))`,
        output: `[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
        commonError: '试图对生成器对象进行索引访问，或重复遍历已耗尽的生成器',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c2-1',
        question: 'Python中列表和元组的区别是什么？',
        answer: '列表是可变序列，支持增删改操作；元组是不可变序列，创建后不能修改。元组因不可变性可以作为字典键和集合元素，且在性能上略优于列表。',
        difficulty: '基础',
        keyPoints: ['可变与不可变', '元组可做字典键', '性能差异'],
        commonMisconceptions: ['认为元组中的可变对象也不可修改', '认为列表和元组可以互相完全替代'],
        relatedConcepts: ['可哈希性', '序列类型'],
        followUpQuestions: ['元组中包含列表时能修改列表内容吗？', '什么场景下应该优先选择元组？'],
      } as FAQItem,
      {
        id: 'faq-c2-2',
        question: '什么是Python的GIL？对多线程有什么影响？',
        answer: 'GIL（全局解释器锁）是CPython中的一把互斥锁，确保同一时刻只有一个线程执行Python字节码。它导致CPU密集型任务无法真正并行，但I/O密集型任务受影响较小。',
        difficulty: '深入',
        keyPoints: ['CPython特有', 'CPU密集型受限', 'I/O密集型影响小'],
        commonMisconceptions: ['认为GIL意味着Python不支持多线程', '认为所有Python实现都有GIL'],
        relatedConcepts: ['多进程', 'asyncio异步编程'],
        followUpQuestions: ['如何绕过GIL的限制？', 'asyncio和线程各自的适用场景？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c2-1', 'lab-c2-2'],
    assessmentIds: ['assess-c2-pre', 'assess-c2-unit'],
    estimatedHours: 35,
  },
  {
    id: 3,
    objectives: [
      { level: 'L1-认知', description: '理解面向对象编程的封装、继承、多态三大核心概念' },
      { level: 'L2-应用', description: '能够使用Java集合框架、异常处理和泛型编写面向对象程序' },
      { level: 'L3-综合', description: '综合运用多线程、Lambda表达式和设计模式开发复杂Java应用' },
    ] as BloomObjective[],
    prerequisiteCourses: [1, 2],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c3-1',
        title: '接口与多态',
        description: '通过接口实现多态行为，展示运行时动态绑定',
        level: '进阶',
        code: `interface Shape {
    double area();
}
class Circle implements Shape {
    private double radius;
    public Circle(double r) { this.radius = r; }
    public double area() { return Math.PI * radius * radius; }
}
class Rectangle implements Shape {
    private double width, height;
    public Rectangle(double w, double h) { this.width = w; this.height = h; }
    public double area() { return width * height; }
}
public class Main {
    public static void printArea(Shape s) {
        System.out.println("面积: " + s.area());
    }
    public static void main(String[] args) {
        printArea(new Circle(5));
        printArea(new Rectangle(4, 6));
    }
}`,
        output: `面积: 78.53981633974483
面积: 24.0`,
        commonError: '接口方法未全部实现导致编译错误，或混淆接口引用与实际类型',
        language: 'java',
      } as CodeExampleV2,
      {
        id: 'code-c3-2',
        title: 'Stream API与Lambda',
        description: '使用Stream API和Lambda表达式进行函数式数据处理',
        level: '高级',
        code: `import java.util.*;
import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("张三", "李四", "王五", "赵六", "钱七");
        List<String> result = names.stream()
            .filter(n -> n.length() >= 2)
            .map(n -> "你好, " + n)
            .collect(Collectors.toList());
        result.forEach(System.out::println);
    }
}`,
        output: `你好, 张三
你好, 李四
你好, 王五
你好, 赵六
你好, 钱七`,
        commonError: '在Stream操作中修改外部状态，或混淆中间操作和终端操作',
        language: 'java',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c3-1',
        question: '接口和抽象类有什么区别？如何选择？',
        answer: '抽象类可以有构造方法、实例变量和方法实现，单继承；接口只能有常量和抽象方法（Java 8后可有default方法），多实现。需要共享代码用抽象类，需要定义行为契约用接口。',
        difficulty: '基础',
        keyPoints: ['单继承vs多实现', 'default方法', '行为契约vs代码复用'],
        commonMisconceptions: ['认为接口完全不能有方法实现', '认为抽象类和接口可以互相替代'],
        relatedConcepts: ['多态', '设计模式'],
        followUpQuestions: ['Java 8的default方法对接口有什么影响？', '什么时候应该同时使用抽象类和接口？'],
      } as FAQItem,
      {
        id: 'faq-c3-2',
        question: 'HashMap的底层实现原理是什么？',
        answer: 'JDK 1.8中HashMap采用数组+链表+红黑树实现。通过hash算法确定桶位置，冲突元素以链表存储，链表长度超过8时转为红黑树。负载因子默认0.75，超过阈值时扩容为原来的2倍。',
        difficulty: '深入',
        keyPoints: ['数组+链表+红黑树', '链表转红黑树阈值8', '负载因子0.75'],
        commonMisconceptions: ['认为HashMap是有序的', '认为null键和null值都不允许'],
        relatedConcepts: ['红黑树', '散列表'],
        followUpQuestions: ['为什么链表转红黑树的阈值是8？', 'HashMap和ConcurrentHashMap的区别？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c3-1', 'lab-c3-2'],
    assessmentIds: ['assess-c3-pre', 'assess-c3-unit'],
    estimatedHours: 50,
  },
  {
    id: 4,
    objectives: [
      { level: 'L1-认知', description: '理解C++类与对象、构造析构函数、继承与多态机制' },
      { level: 'L2-应用', description: '能够使用STL容器、模板和智能指针编写类型安全的C++程序' },
      { level: 'L3-综合', description: '综合运用RAII、移动语义和模板元编程设计高性能C++系统' },
    ] as BloomObjective[],
    prerequisiteCourses: [1],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c4-1',
        title: '智能指针与RAII',
        description: '使用unique_ptr和shared_ptr管理动态内存，演示RAII原则',
        level: '进阶',
        code: `#include <iostream>
#include <memory>
class Resource {
public:
    Resource() { std::cout << "资源获取" << std::endl; }
    ~Resource() { std::cout << "资源释放" << std::endl; }
    void use() { std::cout << "使用资源" << std::endl; }
};
int main() {
    {
        auto ptr1 = std::make_unique<Resource>();
        ptr1->use();
    }
    {
        auto ptr2 = std::make_shared<Resource>();
        auto ptr3 = ptr2;
        std::cout << "引用计数: " << ptr2.use_count() << std::endl;
    }
    return 0;
}`,
        output: `资源获取
使用资源
资源释放
资源获取
引用计数: 2
资源释放`,
        commonError: '使用shared_ptr造成循环引用导致内存泄漏，或对unique_ptr使用拷贝而非移动语义',
        language: 'cpp',
      } as CodeExampleV2,
      {
        id: 'code-c4-2',
        title: '模板与STL',
        description: '使用函数模板和STL容器实现泛型数据处理',
        level: '进阶',
        code: `#include <iostream>
#include <vector>
#include <algorithm>
template<typename T>
T find_max(const std::vector<T>& vec) {
    return *std::max_element(vec.begin(), vec.end());
}
int main() {
    std::vector<int> nums = {3, 7, 1, 9, 4};
    std::vector<double> vals = {2.5, 8.1, 3.7};
    std::cout << "整数最大值: " << find_max(nums) << std::endl;
    std::cout << "浮点最大值: " << find_max(vals) << std::endl;
    return 0;
}`,
        output: `整数最大值: 9
浮点最大值: 8.1`,
        commonError: '模板定义与声明分离导致链接错误，或模板类型推导失败',
        language: 'cpp',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c4-1',
        question: 'C++中虚函数是如何实现的？虚函数表是什么？',
        answer: '编译器为每个含虚函数的类生成一个虚函数表（vtable），存储虚函数指针。对象中包含指向vtable的虚指针（vptr），运行时通过vptr查找vtable实现动态绑定。',
        difficulty: '深入',
        keyPoints: ['vtable虚函数表', 'vptr虚指针', '动态绑定机制'],
        commonMisconceptions: ['认为虚函数调用没有性能开销', '认为构造函数可以是虚函数'],
        relatedConcepts: ['多态', 'RTTI'],
        followUpQuestions: ['虚函数调用的性能开销有多大？', '为什么构造函数不能是虚函数？'],
      } as FAQItem,
      {
        id: 'faq-c4-2',
        question: '什么是RAII？在C++中如何应用？',
        answer: 'RAII（资源获取即初始化）是一种利用对象生命周期管理资源的编程范式。构造时获取资源，析构时释放资源，确保异常安全。智能指针、文件流、锁守卫都是RAII的典型应用。',
        difficulty: '基础',
        keyPoints: ['构造获取析构释放', '异常安全', '智能指针'],
        commonMisconceptions: ['认为RAII只适用于内存管理', '认为手动delete比智能指针更可控'],
        relatedConcepts: ['智能指针', '异常安全'],
        followUpQuestions: ['std::lock_guard如何实现RAII？', 'RAII如何保证异常安全？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c4-1', 'lab-c4-2'],
    assessmentIds: ['assess-c4-pre', 'assess-c4-unit'],
    estimatedHours: 50,
  },
  {
    id: 5,
    objectives: [
      { level: 'L1-认知', description: '理解线性表、栈、队列、树、图等基本数据结构的逻辑定义和存储方式' },
      { level: 'L2-应用', description: '能够选择合适的数据结构解决实际问题，实现基本操作并分析时空复杂度' },
      { level: 'L3-综合', description: '综合运用多种数据结构设计高效算法，理解B+树、红黑树等高级结构的工程应用' },
    ] as BloomObjective[],
    prerequisiteCourses: [1],
    successorCourses: [6, 7, 11, 22],
    codeExamples: [
      {
        id: 'code-c5-1',
        title: '链表反转',
        description: '实现单链表的反转操作，展示指针操作技巧',
        level: '进阶',
        code: `#include <stdio.h>
#include <stdlib.h>
typedef struct Node {
    int data;
    struct Node *next;
} Node;
Node* reverse(Node *head) {
    Node *prev = NULL, *curr = head, *next = NULL;
    while (curr) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
        output: `原链表: 1 -> 2 -> 3 -> 4 -> 5
反转后: 5 -> 4 -> 3 -> 2 -> 1`,
        commonError: '忘记保存next指针导致链表断裂，或遗漏空链表的边界情况',
        language: 'c',
      } as CodeExampleV2,
      {
        id: 'code-c5-2',
        title: '二叉树遍历',
        description: '实现二叉树的前序、中序、后序递归遍历',
        level: '进阶',
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder(root):
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def inorder(root):
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def postorder(root):
    if not root: return []
    return postorder(root.left) + postorder(root.right) + [root.val]`,
        output: `前序: [1, 2, 4, 5, 3, 6, 7]
中序: [4, 2, 5, 1, 6, 3, 7]
后序: [4, 5, 2, 6, 7, 3, 1]`,
        commonError: '混淆三种遍历的访问顺序，或递归终止条件遗漏导致栈溢出',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c5-3',
        title: 'BFS图遍历',
        description: '使用邻接表和BFS实现图的广度优先搜索',
        level: '高级',
        code: `from collections import deque
def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result

graph = {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]}
print(bfs(graph, 0))`,
        output: `[0, 1, 2, 3]`,
        commonError: '忘记标记已访问节点导致重复访问或死循环，或混淆队列的popleft与pop',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c5-1',
        question: '链表和数组各自的优缺点是什么？',
        answer: '数组支持O(1)随机访问但插入删除需O(n)移动元素；链表插入删除O(1)但不支持随机访问且需额外指针空间。数组内存连续对缓存友好，链表节点分散导致缓存不友好。',
        difficulty: '基础',
        keyPoints: ['随机访问vs顺序访问', '插入删除效率', '缓存局部性'],
        commonMisconceptions: ['认为链表插入删除总是O(1)', '忽略链表指针的额外空间开销'],
        relatedConcepts: ['内存布局', '缓存命中率'],
        followUpQuestions: ['什么场景下链表比数组更优？', '如何优化链表的缓存不友好问题？'],
      } as FAQItem,
      {
        id: 'faq-c5-2',
        question: 'B+树相比B树有哪些优势？为什么数据库索引选择B+树？',
        answer: 'B+树所有数据存储在叶子节点并通过链表连接，支持范围查询；内部节点只存键值，扇出更大树更矮，磁盘I/O更少。这些特性使B+树特别适合磁盘存储的数据库索引。',
        difficulty: '深入',
        keyPoints: ['叶子节点链表', '范围查询高效', '扇出更大树更矮'],
        commonMisconceptions: ['认为B+树和B树没有本质区别', '认为B+树也适合内存数据结构'],
        relatedConcepts: ['数据库索引', '磁盘I/O'],
        followUpQuestions: ['B+树的插入和删除如何维护平衡？', '为什么不用红黑树做数据库索引？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c5-1', 'lab-c5-2', 'lab-c5-3'],
    assessmentIds: ['assess-c5-pre', 'assess-c5-unit'],
    estimatedHours: 45,
  },
  {
    id: 6,
    objectives: [
      { level: 'L1-认知', description: '理解算法复杂度分析方法、经典算法范式的基本思想' },
      { level: 'L2-应用', description: '能够应用动态规划、贪心、回溯等算法解决典型问题' },
      { level: 'L3-综合', description: '综合分析问题特征选择最优算法策略，理解NP完全理论与归约证明' },
    ] as BloomObjective[],
    prerequisiteCourses: [5],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c6-1',
        title: '0-1背包问题',
        description: '使用动态规划求解0-1背包问题的最优解',
        level: '高级',
        code: `def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]

print(knapsack_01([2, 3, 4, 5], [3, 4, 5, 6], 8))`,
        output: `10`,
        commonError: '状态转移方程写反导致选了重复物品，或dp数组索引越界',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c6-2',
        title: '归并排序',
        description: '实现分治策略的归并排序算法',
        level: '进阶',
        code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,
        output: `[3, 9, 10, 27, 38, 43, 82]`,
        commonError: '合并时忘记处理剩余元素，或递归终止条件遗漏导致栈溢出',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c6-1',
        question: '动态规划和分治算法的区别是什么？',
        answer: '分治将问题分解为独立子问题分别求解后合并；动态规划处理重叠子问题，通过记忆化或制表避免重复计算。动态规划需要最优子结构性质，分治不需要。',
        difficulty: '基础',
        keyPoints: ['重叠子问题', '最优子结构', '记忆化vs制表'],
        commonMisconceptions: ['认为分治和DP完全不同', '认为所有优化问题都能用DP解决'],
        relatedConcepts: ['递归', '贪心算法'],
        followUpQuestions: ['如何判断一个问题是否具有最优子结构？', '自顶向下和自底向上DP各有什么优劣？'],
      } as FAQItem,
      {
        id: 'faq-c6-2',
        question: 'P类和NP类问题的本质区别是什么？',
        answer: 'P类问题可以在多项式时间内求解；NP类问题的解可以在多项式时间内验证。P⊆NP，但是否P=NP是未解之谜。NP完全问题是NP中最难的问题，若任一NP完全问题有多项式算法则P=NP。',
        difficulty: '深入',
        keyPoints: ['多项式时间求解vs验证', 'P⊆NP', 'NP完全与归约'],
        commonMisconceptions: ['认为NP就是不可解问题', '认为NP问题没有算法'],
        relatedConcepts: ['归约', '近似算法'],
        followUpQuestions: ['如何证明一个问题是NP完全的？', 'NP难和NP完全有什么区别？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c6-1', 'lab-c6-2'],
    assessmentIds: ['assess-c6-pre', 'assess-c6-unit'],
    estimatedHours: 45,
  },
  {
    id: 7,
    objectives: [
      { level: 'L1-认知', description: '理解编译器的整体架构和各阶段的功能职责' },
      { level: 'L2-应用', description: '能够实现简单的词法分析器和语法分析器，理解有限自动机和文法推导' },
      { level: 'L3-综合', description: '综合运用语法制导翻译和代码优化技术完成小型编译器前端' },
    ] as BloomObjective[],
    prerequisiteCourses: [1, 5],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c7-1',
        title: '简单词法分析器',
        description: '使用有限自动机思想实现简单的词法分析',
        level: '进阶',
        code: `import re
TOKEN_SPEC = [
    ('NUMBER', r'\\d+(\\.\\d+)?'),
    ('IDENT',  r'[a-zA-Z_]\\w*'),
    ('OP',     r'[+\\-*/=]'),
    ('SKIP',   r'[ \\t]+'),
    ('NEWLINE', r'\\n'),
    ('MISMATCH', r'.'),
]
def tokenize(code):
    tokens = []
    pos = 0
    while pos < len(code):
        match = None
        for token_type, pattern in TOKEN_SPEC:
            regex = re.compile(pattern)
            match = regex.match(code, pos)
            if match:
                if token_type not in ('SKIP', 'NEWLINE'):
                    tokens.append((token_type, match.group()))
                pos = match.end()
                break
        if not match:
            raise SyntaxError(f'非法字符: {code[pos]}')
    return tokens

print(tokenize("x = 42 + 3.14"))`,
        output: `[('IDENT', 'x'), ('OP', '='), ('NUMBER', '42'), ('OP', '+'), ('NUMBER', '3.14')]`,
        commonError: '正则表达式优先级导致标识符被错误匹配为关键字，或忘记跳过空白字符',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c7-2',
        title: '递归下降语法分析',
        description: '实现简单的算术表达式递归下降解析器',
        level: '高级',
        code: `class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0
    def peek(self):
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None
    def consume(self, expected_type=None):
        token = self.peek()
        if expected_type and token[0] != expected_type:
            raise SyntaxError(f'期望 {expected_type}, 得到 {token}')
        self.pos += 1
        return token
    def expr(self):
        result = self.term()
        while self.peek() and self.peek()[0] == 'OP' and self.peek()[1] in '+-':
            op = self.consume()[1]
            right = self.term()
            result = ('binop', op, result, right)
        return result
    def term(self):
        result = self.factor()
        while self.peek() and self.peek()[0] == 'OP' and self.peek()[1] in '*/':
            op = self.consume()[1]
            right = self.factor()
            result = ('binop', op, result, right)
        return result
    def factor(self):
        token = self.peek()
        if token[0] == 'NUMBER':
            return ('num', self.consume()[1])
        elif token[1] == '(':
            self.consume()
            result = self.expr()
            self.consume()
            return result
        raise SyntaxError(f'意外的token: {token}')`,
        output: `('binop', '+', ('num', '3'), ('binop', '*', ('num', '4'), ('num', '5')))`,
        commonError: '左递归文法导致无限递归，或运算符优先级处理不正确',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c7-1',
        question: '编译器和解释器的区别是什么？',
        answer: '编译器将源代码一次性翻译为目标代码再执行，执行效率高但调试不便；解释器逐行翻译执行，启动快但运行慢。现代语言常采用混合策略如JIT编译。',
        difficulty: '基础',
        keyPoints: ['整体编译vs逐行解释', '执行效率差异', 'JIT混合策略'],
        commonMisconceptions: ['认为编译型语言一定比解释型快', '认为Java是纯解释型语言'],
        relatedConcepts: ['JIT编译', '虚拟机'],
        followUpQuestions: ['JIT编译如何平衡编译时间和执行效率？', '为什么Python比C慢？'],
      } as FAQItem,
      {
        id: 'faq-c7-2',
        question: 'LL(1)和LR(1)分析器各自的特点是什么？',
        answer: 'LL(1)是自顶向下分析，从左到右扫描、最左推导、向前看1个符号，需要消除左递归和提取左公因子；LR(1)是自底向上分析，从左到右扫描、最右归约、向前看1个符号，能处理更广泛的文法。',
        difficulty: '深入',
        keyPoints: ['自顶向下vs自底向上', 'LL需消除左递归', 'LR文法范围更广'],
        commonMisconceptions: ['认为LL(1)能处理所有文法', '认为LR分析不需要FIRST/FOLLOW集'],
        relatedConcepts: ['上下文无关文法', 'FIRST/FOLLOW集'],
        followUpQuestions: ['如何判断一个文法是否为LL(1)文法？', 'LALR(1)和LR(1)有什么区别？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c7-1', 'lab-c7-2'],
    assessmentIds: ['assess-c7-pre', 'assess-c7-unit'],
    estimatedHours: 40,
  },
  {
    id: 8,
    objectives: [
      { level: 'L1-认知', description: '理解冯·诺依曼结构、数据表示和计算机层次结构' },
      { level: 'L2-应用', description: '能够分析Cache映射策略、指令执行流程和存储层次结构' },
      { level: 'L3-综合', description: '综合分析CPU流水线设计、冒险处理和性能优化策略' },
    ] as BloomObjective[],
    prerequisiteCourses: [1],
    successorCourses: [9, 10],
    codeExamples: [
      {
        id: 'code-c8-1',
        title: '补码运算模拟',
        description: '模拟8位补码的加减运算并检测溢出',
        level: '进阶',
        code: `def complement_add(a, b, bits=8):
    mask = (1 << bits) - 1
    result = (a + b) & mask
    a_sign = (a >> (bits - 1)) & 1
    b_sign = (b >> (bits - 1)) & 1
    r_sign = (result >> (bits - 1)) & 1
    overflow = 1 if (a_sign == b_sign and r_sign != a_sign) else 0
    return result, overflow

result, overflow = complement_add(0b01111111, 0b00000001)
print(f"结果: {result:08b} ({result}), 溢出: {overflow}")`,
        output: `结果: 10000000 (128), 溢出: 1`,
        commonError: '混淆补码溢出判断条件，或忽略符号位参与运算的规则',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c8-2',
        title: 'Cache模拟器',
        description: '模拟直接映射Cache的命中与缺失行为',
        level: '进阶',
        code: `class DirectMappedCache:
    def __init__(self, size=4, block_size=1):
        self.size = size
        self.blocks = [None] * size
        self.hits = 0
        self.misses = 0
    def access(self, address):
        index = address % self.size
        if self.blocks[index] == address:
            self.hits += 1
            print(f"地址 {address}: 命中 (行{index})")
        else:
            self.misses += 1
            self.blocks[index] = address
            print(f"地址 {address}: 缺失 (行{index})")

cache = DirectMappedCache(4)
for addr in [0, 4, 0, 8, 4]:
    cache.access(addr)
print(f"命中率: {cache.hits / (cache.hits + cache.misses):.1%}")`,
        output: `地址 0: 缺失 (行0)
地址 4: 缺失 (行0)
地址 0: 缺失 (行0)
地址 8: 缺失 (行0)
地址 4: 缺失 (行0)
命中率: 0.0%`,
        commonError: '混淆直接映射和组相联映射的索引计算，或忽略块偏移的计算',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c8-1',
        question: '什么是流水线冒险？有哪些解决方式？',
        answer: '流水线冒险分为结构冒险（资源冲突）、数据冒险（数据依赖）和控制冒险（分支跳转）。解决方式包括：停顿、数据前递、分支预测和延迟槽等。',
        difficulty: '深入',
        keyPoints: ['三种冒险类型', '前递技术', '分支预测'],
        commonMisconceptions: ['认为流水线越深性能越好', '认为前递能解决所有数据冒险'],
        relatedConcepts: ['超标量', '乱序执行'],
        followUpQuestions: ['分支预测的准确率如何影响性能？', '超标量和流水线有什么关系？'],
      } as FAQItem,
      {
        id: 'faq-c8-2',
        question: 'Cache的写策略有哪些？',
        answer: '写命中时有写直达（同时写Cache和主存）和写回（只写Cache，替换时写回主存）；写缺失时有写分配（先加载再写）和非写分配（直接写主存）。写直达配非写分配，写回配写分配是常见组合。',
        difficulty: '基础',
        keyPoints: ['写直达vs写回', '写分配vs非写分配', '常见组合策略'],
        commonMisconceptions: ['认为写直达一定比写回好', '混淆写策略和替换策略'],
        relatedConcepts: ['Cache一致性', 'MESI协议'],
        followUpQuestions: ['多核处理器如何保证Cache一致性？', 'MESI协议的四种状态是什么？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c8-1', 'lab-c8-2'],
    assessmentIds: ['assess-c8-pre', 'assess-c8-unit'],
    estimatedHours: 40,
  },
  {
    id: 9,
    objectives: [
      { level: 'L1-认知', description: '理解进程线程模型、内存管理和文件系统的基本概念' },
      { level: 'L2-应用', description: '能够分析调度算法、页面置换算法和死锁处理策略' },
      { level: 'L3-综合', description: '综合运用同步机制解决经典并发问题，设计操作系统核心模块' },
    ] as BloomObjective[],
    prerequisiteCourses: [1, 8],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c9-1',
        title: '生产者消费者问题',
        description: '使用信号量实现生产者消费者同步',
        level: '高级',
        code: `import threading
import time
class BoundedBuffer:
    def __init__(self, capacity=5):
        self.buffer = []
        self.mutex = threading.Semaphore(1)
        self.empty = threading.Semaphore(capacity)
        self.full = threading.Semaphore(0)
    def produce(self, item):
        self.empty.acquire()
        self.mutex.acquire()
        self.buffer.append(item)
        print(f"生产: {item}, 缓冲区: {self.buffer}")
        self.mutex.release()
        self.full.release()
    def consume(self):
        self.full.acquire()
        self.mutex.acquire()
        item = self.buffer.pop(0)
        print(f"消费: {item}, 缓冲区: {self.buffer}")
        self.mutex.release()
        self.empty.release()
        return item`,
        output: `生产: 1, 缓冲区: [1]
生产: 2, 缓冲区: [1, 2]
消费: 1, 缓冲区: [2]`,
        commonError: '信号量的P/V操作顺序错误导致死锁，或忘记互斥信号量保护临界区',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c9-2',
        title: '页面置换算法',
        description: '实现FIFO和LRU页面置换算法',
        level: '进阶',
        code: `from collections import deque, OrderedDict
def fifo_replace(pages, frame_count):
    frames = set()
    queue = deque()
    faults = 0
    for page in pages:
        if page not in frames:
            faults += 1
            if len(frames) >= frame_count:
                old = queue.popleft()
                frames.remove(old)
            frames.add(page)
            queue.append(page)
    return faults

def lru_replace(pages, frame_count):
    frames = OrderedDict()
    faults = 0
    for page in pages:
        if page in frames:
            frames.move_to_end(page)
        else:
            faults += 1
            if len(frames) >= frame_count:
                frames.popitem(last=False)
            frames[page] = True
    return faults

pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3]
print(f"FIFO缺页: {fifo_replace(pages, 3)}")
print(f"LRU缺页: {lru_replace(pages, 3)}")`,
        output: `FIFO缺页: 9
LRU缺页: 7`,
        commonError: 'FIFO的Belady异常现象，或LRU实现未正确更新访问顺序',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c9-1',
        question: '进程和线程有什么区别？',
        answer: '进程是资源分配的基本单位，拥有独立地址空间；线程是CPU调度的基本单位，共享进程的地址空间和资源。线程切换开销小于进程，但需要同步共享数据。',
        difficulty: '基础',
        keyPoints: ['资源分配vs调度单位', '地址空间独立vs共享', '切换开销差异'],
        commonMisconceptions: ['认为线程完全没有独立资源', '认为多线程一定比多进程好'],
        relatedConcepts: ['进程通信', '线程同步'],
        followUpQuestions: ['用户级线程和内核级线程有什么区别？', '什么场景下应该用多进程而非多线程？'],
      } as FAQItem,
      {
        id: 'faq-c9-2',
        question: '什么是死锁？产生死锁的四个必要条件是什么？',
        answer: '死锁是多个进程互相等待对方释放资源而永久阻塞的状态。四个必要条件：互斥、持有并等待、不可抢占、循环等待。破坏任一条件即可预防死锁。',
        difficulty: '基础',
        keyPoints: ['四个必要条件', '预防策略', '银行家算法'],
        commonMisconceptions: ['认为只要有资源竞争就会死锁', '认为死锁检测比预防更实用'],
        relatedConcepts: ['银行家算法', '资源分配图'],
        followUpQuestions: ['银行家算法如何避免死锁？', '实际系统中更常用死锁预防还是死锁检测？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c9-1', 'lab-c9-2'],
    assessmentIds: ['assess-c9-pre', 'assess-c9-unit'],
    estimatedHours: 45,
  },
  {
    id: 10,
    objectives: [
      { level: 'L1-认知', description: '理解OSI和TCP/IP网络体系结构及各层功能' },
      { level: 'L2-应用', description: '能够分析TCP拥塞控制、路由算法和应用层协议的工作原理' },
      { level: 'L3-综合', description: '综合设计网络应用，理解网络安全机制和协议交互过程' },
    ] as BloomObjective[],
    prerequisiteCourses: [8],
    successorCourses: [23],
    codeExamples: [
      {
        id: 'code-c10-1',
        title: 'TCP Echo服务器',
        description: '实现简单的TCP回显服务器和客户端',
        level: '进阶',
        code: `import socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 8888))
server.listen(5)
print("服务器启动，等待连接...")
while True:
    client, addr = server.accept()
    print(f"客户端连接: {addr}")
    data = client.recv(1024)
    client.send(f"Echo: {data.decode()}".encode())
    client.close()`,
        output: `服务器启动，等待连接...
客户端连接: ('127.0.0.1', 54321)`,
        commonError: '未处理客户端异常断开导致服务器崩溃，或忘记设置SO_REUSEADDR选项',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c10-2',
        title: '子网划分计算',
        description: '根据IP地址和子网掩码计算网络地址和广播地址',
        level: '进阶',
        code: `def calculate_subnet(ip_str, mask_str):
    ip = list(map(int, ip_str.split('.')))
    mask = list(map(int, mask_str.split('.')))
    network = [i & m for i, m in zip(ip, mask)]
    broadcast = [n | (255 - m) for n, m in zip(network, mask)]
    host_bits = 32 - sum(bin(m).count('1') for m in mask)
    max_hosts = (2 ** host_bits) - 2 if host_bits >= 2 else 0
    print(f"网络地址: {'.'.join(map(str, network))}")
    print(f"广播地址: {'.'.join(map(str, broadcast))}")
    print(f"可用主机数: {max_hosts}")

calculate_subnet('192.168.1.100', '255.255.255.0')`,
        output: `网络地址: 192.168.1.0
广播地址: 192.168.1.255
可用主机数: 254`,
        commonError: '混淆网络地址和广播地址的计算，或忘记减去网络地址和广播地址本身',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c10-1',
        question: 'TCP三次握手和四次挥手的过程是什么？',
        answer: '三次握手：客户端发SYN→服务器回SYN+ACK→客户端发ACK。四次挥手：主动方发FIN→被动方回ACK→被动方发FIN→主动方回ACK。挥手需要四次因为被动方可能还有数据要发送。',
        difficulty: '基础',
        keyPoints: ['SYN同步标志', 'FIN结束标志', 'TIME_WAIT状态'],
        commonMisconceptions: ['认为三次握手可以简化为两次', '不理解TIME_WAIT的作用'],
        relatedConcepts: ['TCP状态机', '拥塞控制'],
        followUpQuestions: ['为什么需要TIME_WAIT状态？', '什么是SYN洪泛攻击？如何防御？'],
      } as FAQItem,
      {
        id: 'faq-c10-2',
        question: '从输入URL到页面显示，中间经历了什么？',
        answer: 'DNS解析→建立TCP连接→发送HTTP请求→服务器处理请求→返回HTTP响应→浏览器解析HTML→构建DOM树和CSSOM→合成渲染树→布局绘制。涉及应用层、传输层、网络层和数据链路层的协议协作。',
        difficulty: '深入',
        keyPoints: ['DNS解析流程', 'TCP三次握手', '浏览器渲染流程'],
        commonMisconceptions: ['忽略DNS缓存的影响', '认为HTTP请求只有一次往返'],
        relatedConcepts: ['DNS', 'HTTP/HTTPS', '浏览器渲染'],
        followUpQuestions: ['DNS解析使用TCP还是UDP？', 'HTTP/2相比HTTP/1.1有什么改进？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c10-1', 'lab-c10-2'],
    assessmentIds: ['assess-c10-pre', 'assess-c10-unit'],
    estimatedHours: 40,
  },
  {
    id: 11,
    objectives: [
      { level: 'L1-认知', description: '理解关系模型、关系代数和数据库系统的基本概念' },
      { level: 'L2-应用', description: '能够编写复杂SQL查询、设计规范化数据库模式并理解索引原理' },
      { level: 'L3-综合', description: '综合运用事务管理、并发控制和恢复技术设计可靠的数据库应用' },
    ] as BloomObjective[],
    prerequisiteCourses: [5],
    successorCourses: [24],
    codeExamples: [
      {
        id: 'code-c11-1',
        title: '复杂SQL查询',
        description: '使用嵌套查询和聚合函数进行数据分析',
        level: '进阶',
        code: `SELECT s.sname, s.sdept, sc.grade
FROM Student s
JOIN SC sc ON s.sno = sc.sno
JOIN Course c ON sc.cno = c.cno
WHERE sc.grade > (
    SELECT AVG(sc2.grade)
    FROM SC sc2
    WHERE sc2.cno = sc.cno
)
ORDER BY sc.grade DESC;`,
        output: `张三 | 计算机系 | 95
李四 | 数学系   | 92
王五 | 计算机系 | 88`,
        commonError: '嵌套查询中相关子查询的性能问题，或GROUP BY遗漏非聚合列',
        language: 'sql',
      } as CodeExampleV2,
      {
        id: 'code-c11-2',
        title: '事务与并发控制',
        description: '演示数据库事务的ACID特性和隔离级别',
        level: '高级',
        code: `BEGIN TRANSACTION;
UPDATE Account SET balance = balance - 500 WHERE id = 'A';
UPDATE Account SET balance = balance + 500 WHERE id = 'B';
COMMIT;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRANSACTION;
SELECT balance FROM Account WHERE id = 'A';
UPDATE Account SET balance = balance - 200 WHERE id = 'A';
COMMIT;`,
        output: `事务1: A余额减少500, B余额增加500
事务2: 读取已提交的A余额并更新`,
        commonError: '忽略隔离级别导致脏读或幻读，或忘记处理事务回滚',
        language: 'sql',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c11-1',
        question: '什么是事务？ACID特性分别是什么？',
        answer: '事务是数据库操作的逻辑单元。ACID：原子性（全做或全不做）、一致性（数据从一个一致状态到另一个）、隔离性（并发事务互不干扰）、持久性（提交后永久保存）。',
        difficulty: '基础',
        keyPoints: ['原子性', '一致性', '隔离性', '持久性'],
        commonMisconceptions: ['认为一致性只指数据类型一致', '认为隔离性意味着串行执行'],
        relatedConcepts: ['并发控制', '恢复技术'],
        followUpQuestions: ['不同隔离级别分别能防止什么问题？', '如何实现事务的原子性？'],
      } as FAQItem,
      {
        id: 'faq-c11-2',
        question: 'B+树索引的优缺点是什么？',
        answer: '优点：支持范围查询、查询稳定（所有数据在叶子节点）、磁盘I/O少（扇出大）；缺点：维护成本高（插入删除需分裂合并）、占用额外空间、对频繁更新的表性能下降。',
        difficulty: '深入',
        keyPoints: ['范围查询优势', '查询稳定', '维护成本'],
        commonMisconceptions: ['认为索引越多越好', '认为B+树索引适合所有查询场景'],
        relatedConcepts: ['B+树', '哈希索引'],
        followUpQuestions: ['什么情况下不应该创建索引？', '聚簇索引和非聚簇索引有什么区别？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c11-1', 'lab-c11-2'],
    assessmentIds: ['assess-c11-pre', 'assess-c11-unit'],
    estimatedHours: 40,
  },
  {
    id: 12,
    objectives: [
      { level: 'L1-认知', description: '理解软件生命周期、过程模型和需求工程的基本概念' },
      { level: 'L2-应用', description: '能够使用UML建模、设计模式和架构模式进行软件设计' },
      { level: 'L3-综合', description: '综合运用DevOps实践、CI/CD流程完成软件项目的全生命周期管理' },
    ] as BloomObjective[],
    prerequisiteCourses: [2],
    successorCourses: [13],
    codeExamples: [
      {
        id: 'code-c12-1',
        title: '单例模式实现',
        description: '使用Python实现线程安全的单例模式',
        level: '进阶',
        code: `import threading
class Singleton:
    _instance = None
    _lock = threading.Lock()
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    def __init__(self):
        if self._initialized:
            return
        self.config = {"debug": False}
        self._initialized = True

a = Singleton()
b = Singleton()
print(f"a is b: {a is b}")
print(f"配置: {a.config}")`,
        output: `a is b: True
配置: {'debug': False}`,
        commonError: '忘记双重检查锁定导致线程不安全，或在__init__中重复初始化',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c12-2',
        title: 'CI/CD流水线配置',
        description: 'GitHub Actions自动化测试与部署配置示例',
        level: '高级',
        code: `name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest --cov=src tests/
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t myapp:latest .
      - run: docker push myregistry/myapp:latest`,
        output: `✓ 测试通过 (覆盖率: 92%)
✓ Docker镜像构建成功
✓ 部署完成`,
        commonError: '流水线步骤缺少依赖或环境变量未配置，或部署条件设置不当',
        language: 'yaml',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c12-1',
        question: '瀑布模型和敏捷开发的核心区别是什么？',
        answer: '瀑布模型是线性顺序执行，需求明确且变更少时适用；敏捷开发是迭代增量式，拥抱变化，通过短周期迭代持续交付价值。敏捷强调用户反馈和团队协作。',
        difficulty: '基础',
        keyPoints: ['线性vs迭代', '文档驱动vs价值驱动', '变更适应能力'],
        commonMisconceptions: ['认为敏捷不需要文档', '认为瀑布模型已完全过时'],
        relatedConcepts: ['Scrum', '看板方法'],
        followUpQuestions: ['Scrum的核心角色和仪式有哪些？', '什么项目适合瀑布模型？'],
      } as FAQItem,
      {
        id: 'faq-c12-2',
        question: '什么是高内聚低耦合？为什么重要？',
        answer: '高内聚指模块内部元素紧密相关、职责单一；低耦合指模块间依赖关系少、接口简单。高内聚低耦合使系统易于理解、维护和扩展，降低修改一个模块对其他模块的影响。',
        difficulty: '基础',
        keyPoints: ['职责单一', '依赖最小化', '可维护性'],
        commonMisconceptions: ['认为低耦合就是没有依赖', '认为内聚和耦合完全独立'],
        relatedConcepts: ['设计模式', 'SOLID原则'],
        followUpQuestions: ['如何度量模块的内聚度和耦合度？', 'SOLID原则如何帮助实现高内聚低耦合？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c12-1', 'lab-c12-2'],
    assessmentIds: ['assess-c12-pre', 'assess-c12-unit'],
    estimatedHours: 35,
  },
  {
    id: 13,
    objectives: [
      { level: 'L1-认知', description: '理解软件测试的基本原则、级别和类型分类' },
      { level: 'L2-应用', description: '能够使用等价类划分、边界值分析设计测试用例，编写单元测试' },
      { level: 'L3-综合', description: '综合运用自动化测试框架和性能测试工具构建持续质量保障体系' },
    ] as BloomObjective[],
    prerequisiteCourses: [12],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c13-1',
        title: 'PyTest单元测试',
        description: '使用PyTest编写参数化单元测试',
        level: '进阶',
        code: `import pytest
def is_valid_email(email: str) -> bool:
    if not email or '@' not in email: return False
    local, domain = email.rsplit('@', 1)
    if not local or not domain or '.' not in domain: return False
    return True

@pytest.mark.parametrize("email,expected", [
    ("user@example.com", True),
    ("invalid-email", False),
    ("@nodomain.com", False),
    ("no@domain", False),
    ("", False),
])
def test_email_validation(email, expected):
    assert is_valid_email(email) == expected`,
        output: `===== 5 passed in 0.02s =====`,
        commonError: '测试用例覆盖不充分，或参数化数据包含不相关的测试场景',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c13-2',
        title: '边界值分析',
        description: '基于边界值分析方法设计测试用例',
        level: '进阶',
        code: `def check_age(age: int) -> str:
    if age < 0 or age > 150:
        return "无效年龄"
    elif age < 18:
        return "未成年"
    elif age < 60:
        return "成年"
    else:
        return "老年"

boundary_tests = {
    -1: "无效年龄", 0: "未成年", 1: "未成年",
    17: "未成年", 18: "成年", 59: "成年",
    60: "老年", 149: "老年", 150: "老年", 151: "无效年龄"
}
for age, expected in boundary_tests.items():
    result = check_age(age)
    status = "✓" if result == expected else "✗"
    print(f"{status} age={age}: {result} (期望: {expected})")`,
        output: `✓ age=-1: 无效年龄 (期望: 无效年龄)
✓ age=0: 未成年 (期望: 未成年)
✓ age=17: 未成年 (期望: 未成年)
✓ age=18: 成年 (期望: 成年)
✓ age=60: 老年 (期望: 老年)`,
        commonError: '只测试正常值而忽略边界值和异常值，或边界值选取不精确',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c13-1',
        question: '黑盒测试和白盒测试的区别是什么？',
        answer: '黑盒测试不考虑内部结构，基于需求规格设计测试用例；白盒测试基于代码结构，关注逻辑覆盖。黑盒验证功能正确性，白盒验证实现正确性，两者互补。',
        difficulty: '基础',
        keyPoints: ['基于需求vs基于代码', '功能验证vs逻辑覆盖', '互补关系'],
        commonMisconceptions: ['认为白盒测试比黑盒更彻底', '认为只需一种测试方法即可'],
        relatedConcepts: ['等价类划分', '语句覆盖'],
        followUpQuestions: ['如何选择黑盒和白盒测试的比例？', '什么是灰盒测试？'],
      } as FAQItem,
      {
        id: 'faq-c13-2',
        question: '什么是TDD？它的流程是什么？',
        answer: 'TDD（测试驱动开发）是先写测试再写实现的开发方法。流程：红（写失败测试）→绿（写最少代码使测试通过）→重构（优化代码保持测试通过）。优点是代码质量高、设计更合理。',
        difficulty: '深入',
        keyPoints: ['红-绿-重构循环', '测试先行', '最小实现'],
        commonMisconceptions: ['认为TDD只是先写测试', '认为TDD会降低开发速度'],
        relatedConcepts: ['持续集成', '代码覆盖率'],
        followUpQuestions: ['TDD在大型项目中如何实践？', 'TDD和BDD有什么区别？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c13-1', 'lab-c13-2'],
    assessmentIds: ['assess-c13-pre', 'assess-c13-unit'],
    estimatedHours: 30,
  },
  {
    id: 14,
    objectives: [
      { level: 'L1-认知', description: '理解数理逻辑、集合论和图论的基本概念与术语' },
      { level: 'L2-应用', description: '能够运用逻辑推理、关系运算和图论算法解决离散结构问题' },
      { level: 'L3-综合', description: '综合运用代数系统和组合数学方法分析复杂离散问题，建立数学模型' },
    ] as BloomObjective[],
    prerequisiteCourses: [],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c14-1',
        title: '图的遍历与最短路径',
        description: '使用Dijkstra算法求解带权图最短路径',
        level: '进阶',
        code: `import heapq
def dijkstra(graph, start):
    dist = {v: float('inf') for v in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist

graph = {'A': [('B',2),('C',5)], 'B': [('C',1),('D',4)], 'C': [('D',1)], 'D': []}
print(dijkstra(graph, 'A'))`,
        output: `{'A': 0, 'B': 2, 'C': 3, 'D': 4}`,
        commonError: '图中存在负权边时Dijkstra算法失效，或忘记跳过已处理节点',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c14-2',
        title: '命题逻辑推理',
        description: '使用真值表验证逻辑等价式',
        level: '进阶',
        code: `from itertools import product
def implies(p, q): return (not p) or q
def check_equivalence():
    print("验证 德摩根定律: ¬(P∧Q) ≡ ¬P∨¬Q")
    print("P     Q     ¬(P∧Q)  ¬P∨¬Q   等价?")
    for p, q in product([True, False], repeat=2):
        left = not (p and q)
        right = (not p) or (not q)
        print(f"{p:<6}{q:<6}{left:<8}{right:<8}{left == right}")

check_equivalence()`,
        output: `验证 德摩根定律: ¬(P∧Q) ≡ ¬P∨¬Q
P     Q     ¬(P∧Q)  ¬P∨¬Q   等价?
True  True  False   False   True
True  False True    True    True
False True  True    True    True
False False True    True    True`,
        commonError: '混淆蕴含和等价的真值表，或遗漏真值赋值组合',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c14-1',
        question: '命题逻辑和谓词逻辑的区别是什么？',
        answer: '命题逻辑以命题为基本单位，不可分解；谓词逻辑引入量词和谓词，可以分析命题内部结构。谓词逻辑表达力更强，能处理"所有""存在"等量化陈述。',
        difficulty: '基础',
        keyPoints: ['命题不可分解vs可分解', '量词∀和∃', '表达力差异'],
        commonMisconceptions: ['认为命题逻辑能处理所有逻辑推理', '混淆自由变量和约束变量'],
        relatedConcepts: ['逻辑等价', '推理规则'],
        followUpQuestions: ['谓词逻辑的可靠性定理和完备性定理是什么？', '一阶逻辑和高阶逻辑有什么区别？'],
      } as FAQItem,
      {
        id: 'faq-c14-2',
        question: '等价关系和偏序关系的定义和区别是什么？',
        answer: '等价关系满足自反性、对称性和传递性，将集合划分为等价类；偏序关系满足自反性、反对称性和传递性，描述元素间的偏序结构。等价关系用于分类，偏序关系用于排序。',
        difficulty: '深入',
        keyPoints: ['对称性vs反对称性', '等价类划分', '偏序集与哈斯图'],
        commonMisconceptions: ['认为等价关系和偏序关系可以同时成立', '混淆反对称性和非对称性'],
        relatedConcepts: ['商集', '格'],
        followUpQuestions: ['什么是哈斯图？如何绘制？', '等价关系和划分有什么一一对应关系？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c14-1', 'lab-c14-2'],
    assessmentIds: ['assess-c14-pre', 'assess-c14-unit'],
    estimatedHours: 35,
  },
  {
    id: 15,
    objectives: [
      { level: 'L1-认知', description: '理解概率论基本概念、随机变量和常见概率分布' },
      { level: 'L2-应用', description: '能够应用贝叶斯公式、参数估计和假设检验解决统计推断问题' },
      { level: 'L3-综合', description: '综合运用回归分析和统计建模方法进行数据分析和预测' },
    ] as BloomObjective[],
    prerequisiteCourses: [],
    successorCourses: [17],
    codeExamples: [
      {
        id: 'code-c15-1',
        title: '贝叶斯公式应用',
        description: '使用贝叶斯公式计算后验概率',
        level: '进阶',
        code: `def bayesian(prior, sensitivity, specificity):
    p_positive = sensitivity * prior + (1 - specificity) * (1 - prior)
    posterior = (sensitivity * prior) / p_positive
    return posterior

prior = 0.001
sensitivity = 0.99
specificity = 0.95
posterior = bayesian(prior, sensitivity, specificity)
print(f"先验概率: {prior}")
print(f"检测阳性后后验概率: {posterior:.4f}")`,
        output: `先验概率: 0.001
检测阳性后后验概率: 0.0194`,
        commonError: '混淆先验概率和后验概率，或忽略基础概率谬误',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c15-2',
        title: '最大似然估计',
        description: '对正态分布参数进行最大似然估计',
        level: '进阶',
        code: `import numpy as np
np.random.seed(42)
true_mu, true_sigma = 5.0, 2.0
samples = np.random.normal(true_mu, true_sigma, 1000)
mle_mu = np.mean(samples)
mle_sigma = np.std(samples, ddof=0)
print(f"真实均值: {true_mu}, MLE均值: {mle_mu:.4f}")
print(f"真实标准差: {true_sigma}, MLE标准差: {mle_sigma:.4f}")`,
        output: `真实均值: 5.0, MLE均值: 4.9484
真实标准差: 2.0, MLE标准差: 1.9898`,
        commonError: '混淆MLE和无偏估计，或忘记MLE的sigma使用ddof=0',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c15-1',
        question: '条件概率和贝叶斯公式的核心思想是什么？',
        answer: '条件概率P(A|B)表示在B发生条件下A发生的概率。贝叶斯公式将P(A|B)转化为P(B|A)·P(A)/P(B)，实现从结果推原因的逆向概率推理，是贝叶斯统计的核心。',
        difficulty: '基础',
        keyPoints: ['条件概率定义', '逆向概率推理', '先验与后验'],
        commonMisconceptions: ['认为P(A|B)等于P(B|A)', '忽略基础概率的影响'],
        relatedConcepts: ['全概率公式', '贝叶斯分类器'],
        followUpQuestions: ['什么是基础概率谬误？', '贝叶斯学派和频率学派有什么分歧？'],
      } as FAQItem,
      {
        id: 'faq-c15-2',
        question: '什么是最大似然估计（MLE）？',
        answer: 'MLE是在给定观测数据下，寻找使似然函数最大的参数值。直觉是：当前观测到的数据是最可能出现的，因此选择使这组数据出现概率最大的参数。',
        difficulty: '深入',
        keyPoints: ['似然函数', '参数最大化', '对数似然'],
        commonMisconceptions: ['认为似然就是概率', '认为MLE总是无偏的'],
        relatedConcepts: ['贝叶斯估计', '矩估计'],
        followUpQuestions: ['MLE和矩估计各有什么优缺点？', '如何证明MLE的一致性？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c15-1', 'lab-c15-2'],
    assessmentIds: ['assess-c15-pre', 'assess-c15-unit'],
    estimatedHours: 40,
  },
  {
    id: 16,
    objectives: [
      { level: 'L1-认知', description: '理解人工智能的定义、发展历史和主要研究范式' },
      { level: 'L2-应用', description: '能够实现搜索算法和知识表示方法解决简单AI问题' },
      { level: 'L3-综合', description: '综合评估AI系统的伦理影响，理解神经网络和机器学习的基本原理' },
    ] as BloomObjective[],
    prerequisiteCourses: [2],
    successorCourses: [17],
    codeExamples: [
      {
        id: 'code-c16-1',
        title: 'A*搜索算法',
        description: '实现A*启发式搜索算法求解最短路径',
        level: '进阶',
        code: `import heapq
def a_star(start, goal, heuristic, neighbors):
    open_set = [(heuristic(start, goal), 0, start, [start])]
    closed_set = set()
    while open_set:
        f, g, current, path = heapq.heappop(open_set)
        if current == goal:
            return path, g
        if current in closed_set:
            continue
        closed_set.add(current)
        for neighbor, cost in neighbors(current):
            if neighbor not in closed_set:
                new_g = g + cost
                heapq.heappush(open_set, (new_g + heuristic(neighbor, goal), new_g, neighbor, path + [neighbor]))
    return None, float('inf')`,
        output: `路径: ['A', 'B', 'C', 'D'], 代价: 4`,
        commonError: '启发函数不可容许导致找不到最优解，或忘记维护closed_set导致重复访问',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c16-2',
        title: '简单感知机',
        description: '实现单层感知机进行二分类',
        level: '入门',
        code: `import numpy as np
class Perceptron:
    def __init__(self, lr=0.1, epochs=100):
        self.lr = lr
        self.epochs = epochs
    def fit(self, X, y):
        self.w = np.zeros(X.shape[1])
        self.b = 0
        for _ in range(self.epochs):
            for xi, yi in zip(X, y):
                pred = 1 if np.dot(xi, self.w) + self.b >= 0 else 0
                self.w += self.lr * (yi - pred) * xi
                self.b += self.lr * (yi - pred)
    def predict(self, X):
        return (np.dot(X, self.w) + self.b >= 0).astype(int)

X = np.array([[0,0],[0,1],[1,0],[1,1]])
y = np.array([0,0,0,1])
p = Perceptron()
p.fit(X, y)
print(p.predict(X))`,
        output: `[0 0 0 1]`,
        commonError: '感知机无法解决XOR问题，或学习率设置不当导致不收敛',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c16-1',
        question: '什么是图灵测试？它有什么意义和局限性？',
        answer: '图灵测试由Alan Turing提出，如果机器能在对话中使人类无法区分其与真人，则认为机器具有智能。意义在于提供了可操作的智能判断标准；局限性在于只测试语言行为，不涉及理解、意识等深层智能。',
        difficulty: '基础',
        keyPoints: ['行为主义智能观', '对话测试', '中文房间反驳'],
        commonMisconceptions: ['认为通过图灵测试等于真正理解', '认为图灵测试是唯一的智能评估标准'],
        relatedConcepts: ['中文房间实验', 'AI伦理'],
        followUpQuestions: ['中文房间实验如何反驳图灵测试？', '现代AI如何评估智能水平？'],
      } as FAQItem,
      {
        id: 'faq-c16-2',
        question: '人工智能、机器学习和深度学习之间的关系是什么？',
        answer: 'AI是最广泛的概念，指让机器模拟人类智能；ML是AI的子集，通过数据学习规律而非显式编程；DL是ML的子集，使用多层神经网络自动提取特征。三者是包含关系：AI⊃ML⊃DL。',
        difficulty: '基础',
        keyPoints: ['包含关系', '数据驱动学习', '自动特征提取'],
        commonMisconceptions: ['认为深度学习就是人工智能', '认为机器学习必须用神经网络'],
        relatedConcepts: ['神经网络', '特征工程'],
        followUpQuestions: ['什么问题适合传统ML而非DL？', '深度学习为什么在2012年后快速发展？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c16-1', 'lab-c16-2'],
    assessmentIds: ['assess-c16-pre', 'assess-c16-unit'],
    estimatedHours: 30,
  },
  {
    id: 17,
    objectives: [
      { level: 'L1-认知', description: '理解监督学习、无监督学习和模型评估的基本概念' },
      { level: 'L2-应用', description: '能够实现KNN、决策树、SVM等经典算法并调参优化' },
      { level: 'L3-综合', description: '综合运用特征工程、集成学习和模型选择策略构建完整ML流程' },
    ] as BloomObjective[],
    prerequisiteCourses: [2, 15, 16],
    successorCourses: [18, 21],
    codeExamples: [
      {
        id: 'code-c17-1',
        title: 'KNN分类器',
        description: '从零实现K-近邻分类算法',
        level: '入门',
        code: `import numpy as np
class KNN:
    def __init__(self, k=3):
        self.k = k
    def fit(self, X, y):
        self.X_train = X
        self.y_train = y
    def predict(self, X):
        predictions = []
        for x in X:
            distances = np.sqrt(np.sum((self.X_train - x) ** 2, axis=1))
            k_indices = np.argsort(distances)[:self.k]
            k_labels = self.y_train[k_indices]
            predictions.append(np.bincount(k_labels).argmax())
        return np.array(predictions)

X = np.array([[1,1],[2,2],[3,3],[6,6],[7,7],[8,8]])
y = np.array([0,0,0,1,1,1])
knn = KNN(k=3)
knn.fit(X, y)
print(knn.predict(np.array([[2,2.5],[5,5]])))`,
        output: `[0 1]`,
        commonError: 'K值选择不当导致过拟合或欠拟合，或忘记特征归一化',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c17-2',
        title: '决策树与信息增益',
        description: '基于信息增益实现简单的决策树',
        level: '进阶',
        code: `import numpy as np
from collections import Counter
def entropy(y):
    counts = Counter(y)
    probs = [c / len(y) for c in counts.values()]
    return -sum(p * np.log2(p) for p in probs)

def info_gain(X, y, feature_idx):
    total_entropy = entropy(y)
    values = set(X[:, feature_idx])
    weighted_entropy = 0
    for v in values:
        subset_y = y[X[:, feature_idx] == v]
        weighted_entropy += (len(subset_y) / len(y)) * entropy(subset_y)
    return total_entropy - weighted_entropy

X = np.array([['晴','热'],['阴','热'],['雨','凉'],['晴','凉']])
y = np.array(['否', '是', '是', '否'])
print(f"天气信息增益: {info_gain(X, y, 0):.4f}")
print(f"温度信息增益: {info_gain(X, y, 1):.4f}")`,
        output: `天气信息增益: 0.3113
温度信息增益: 0.3113`,
        commonError: '信息增益偏向取值多的特征，或忘记处理连续值特征的离散化',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c17-1',
        question: '监督学习和无监督学习的区别是什么？',
        answer: '监督学习使用标注数据训练模型，目标是学习输入到输出的映射（分类/回归）；无监督学习使用无标注数据，目标是发现数据内在结构（聚类/降维）。',
        difficulty: '基础',
        keyPoints: ['标注vs无标注', '预测vs发现', '分类回归vs聚类降维'],
        commonMisconceptions: ['认为无监督学习没有目标', '认为监督学习一定比无监督好'],
        relatedConcepts: ['半监督学习', '自监督学习'],
        followUpQuestions: ['什么是半监督学习？适用什么场景？', '自监督学习如何生成标签？'],
      } as FAQItem,
      {
        id: 'faq-c17-2',
        question: '什么是过拟合？如何防止？',
        answer: '过拟合是模型在训练集上表现好但在测试集上表现差，因为学到了训练数据的噪声。防止方法：增加数据量、正则化（L1/L2）、Dropout、早停、交叉验证、简化模型。',
        difficulty: '基础',
        keyPoints: ['训练好测试差', '正则化', '交叉验证'],
        commonMisconceptions: ['认为模型越复杂越好', '认为训练误差为0就是好模型'],
        relatedConcepts: ['偏差方差权衡', '正则化'],
        followUpQuestions: ['L1和L2正则化有什么区别？', '交叉验证如何帮助选择模型？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c17-1', 'lab-c17-2'],
    assessmentIds: ['assess-c17-pre', 'assess-c17-unit'],
    estimatedHours: 50,
  },
  {
    id: 18,
    objectives: [
      { level: 'L1-认知', description: '理解神经网络的基本结构、前向传播和反向传播原理' },
      { level: 'L2-应用', description: '能够使用深度学习框架构建CNN和RNN模型解决实际问题' },
      { level: 'L3-综合', description: '综合运用优化技巧、正则化方法和经典架构设计高性能深度学习系统' },
    ] as BloomObjective[],
    prerequisiteCourses: [17],
    successorCourses: [19, 20],
    codeExamples: [
      {
        id: 'code-c18-1',
        title: '简单神经网络前向传播',
        description: '从零实现多层感知机的前向传播',
        level: '进阶',
        code: `import numpy as np
class NeuralNetwork:
    def __init__(self, layers):
        self.weights = [np.random.randn(layers[i], layers[i+1]) * 0.01
                       for i in range(len(layers)-1)]
        self.biases = [np.zeros((1, layers[i+1])) for i in range(len(layers)-1)]

    def sigmoid(self, z): return 1 / (1 + np.exp(-z))

    def forward(self, X):
        self.activations = [X]
        for W, b in zip(self.weights, self.biases):
            z = self.activations[-1] @ W + b
            self.activations.append(self.sigmoid(z))
        return self.activations[-1]

nn = NeuralNetwork([2, 4, 1])
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
output = nn.forward(X)
print(f"输出:\\n{output}")`,
        output: `输出:
[[0.5]
 [0.5]
 [0.5]
 [0.5]]`,
        commonError: '权重初始化过大导致梯度消失，或忘记添加偏置项',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c18-2',
        title: 'CNN卷积操作',
        description: '手动实现二维卷积操作理解CNN原理',
        level: '进阶',
        code: `import numpy as np
def conv2d(image, kernel, stride=1):
    h, w = image.shape
    kh, kw = kernel.shape
    oh = (h - kh) // stride + 1
    ow = (w - kw) // stride + 1
    output = np.zeros((oh, ow))
    for i in range(oh):
        for j in range(ow):
            region = image[i*stride:i*stride+kh, j*stride:j*stride+kw]
            output[i, j] = np.sum(region * kernel)
    return output

image = np.array([[1,2,3,0],[0,1,2,3],[3,0,1,2],[2,3,0,1]])
kernel = np.array([[1,0],[0,-1]])
print(conv2d(image, kernel))`,
        output: `[[ 1.  2. -3.]
 [-3.  1.  2.]
 [ 2. -3.  1.]]`,
        commonError: '混淆卷积和相关运算，或输出尺寸计算错误',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c18-1',
        question: '什么是反向传播？为什么需要它？',
        answer: '反向传播是利用链式法则高效计算神经网络中损失函数对各参数梯度的算法。它避免了对每个参数单独计算梯度，将计算复杂度从O(n²)降到O(n)，是训练深度网络的基础。',
        difficulty: '基础',
        keyPoints: ['链式法则', '梯度计算', '计算效率'],
        commonMisconceptions: ['认为反向传播是优化算法', '混淆反向传播和梯度下降'],
        relatedConcepts: ['自动微分', '梯度下降'],
        followUpQuestions: ['自动微分和数值微分有什么区别？', '为什么梯度消失问题会影响反向传播？'],
      } as FAQItem,
      {
        id: 'faq-c18-2',
        question: '什么是梯度消失/爆炸？如何解决？',
        answer: '梯度消失是反向传播中梯度逐层衰减至接近0，导致浅层参数无法更新；梯度爆炸是梯度逐层放大导致参数更新不稳定。解决方法：ReLU激活函数、残差连接、BatchNorm、梯度裁剪、合适的权重初始化。',
        difficulty: '深入',
        keyPoints: ['梯度衰减/放大', 'ReLU激活', '残差连接'],
        commonMisconceptions: ['认为梯度消失只发生在RNN中', '认为BatchNorm能完全解决梯度问题'],
        relatedConcepts: ['残差网络', 'LSTM'],
        followUpQuestions: ['ResNet的残差连接如何缓解梯度消失？', 'LSTM如何解决RNN的梯度问题？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c18-1', 'lab-c18-2'],
    assessmentIds: ['assess-c18-pre', 'assess-c18-unit'],
    estimatedHours: 50,
  },
  {
    id: 19,
    objectives: [
      { level: 'L1-认知', description: '理解自然语言处理的基本任务和词向量表示方法' },
      { level: 'L2-应用', description: '能够使用注意力机制和Transformer架构处理序列建模任务' },
      { level: 'L3-综合', description: '综合运用BERT/GPT等预训练模型进行NLP应用开发和微调' },
    ] as BloomObjective[],
    prerequisiteCourses: [18],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c19-1',
        title: '自注意力机制',
        description: '手动实现缩放点积注意力计算',
        level: '进阶',
        code: `import numpy as np
def scaled_dot_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = weights / weights.sum(axis=-1, keepdims=True)
    return weights @ V

Q = np.array([[1, 0], [0, 1], [1, 1]], dtype=float)
K = np.array([[1, 0], [0, 1], [1, 1]], dtype=float)
V = np.array([[10, 0], [0, 10], [5, 5]], dtype=float)
output = scaled_dot_attention(Q, K, V)
print(f"注意力输出:\\n{output}")`,
        output: `注意力输出:
[[8.16 1.84]
 [1.84 8.16]
 [5.   5.  ]]`,
        commonError: '忘记缩放因子导致softmax梯度消失，或softmax数值不稳定',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c19-2',
        title: '简单分词与词频统计',
        description: '实现中文文本的基本分词和词频统计',
        level: '入门',
        code: `from collections import Counter
import re
def simple_tokenize(text):
    pattern = re.compile(r'[\\u4e00-\\u9fff]+|[a-zA-Z]+|\\d+')
    segments = pattern.findall(text)
    tokens = []
    for seg in segments:
        if re.match(r'[\\u4e00-\\u9fff]', seg):
            for i in range(len(seg) - 1):
                tokens.append(seg[i:i+2])
        else:
            tokens.append(seg)
    return tokens

text = "自然语言处理是人工智能的重要方向"
tokens = simple_tokenize(text)
freq = Counter(tokens)
print(f"分词结果: {tokens}")
print(f"词频统计: {freq.most_common(5)}")`,
        output: `分词结果: ['自然', '然语', '语言', '言处', '处理', '理是', '是人', '人工', '工智', '智能', '能的', '的重', '重要', '要方', '方向']
词频统计: [('自然', 1), ('然语', 1), ('语言', 1), ('言处', 1), ('处理', 1)]`,
        commonError: '简单bigram分词效果差，实际应使用jieba等专业分词工具',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c19-1',
        question: 'Transformer的自注意力机制原理是什么？',
        answer: '自注意力通过Query、Key、Value三个矩阵计算序列内元素间的关联度。对每个位置计算其与所有位置的注意力权重，加权求和得到新表示。多头注意力允许模型同时关注不同子空间的信息。',
        difficulty: '深入',
        keyPoints: ['QKV计算', '缩放点积', '多头注意力'],
        commonMisconceptions: ['认为注意力权重就是相似度', '忽略位置编码的重要性'],
        relatedConcepts: ['位置编码', '多头注意力'],
        followUpQuestions: ['为什么Transformer需要位置编码？', '多头注意力的头数如何选择？'],
      } as FAQItem,
      {
        id: 'faq-c19-2',
        question: 'BERT和GPT的核心区别是什么？',
        answer: 'BERT是双向编码器，通过掩码语言模型预训练，擅长理解类任务；GPT是单向解码器，通过自回归预测下一个token预训练，擅长生成类任务。BERT看上下文，GPT看前文。',
        difficulty: '基础',
        keyPoints: ['双向vs单向', '理解vs生成', 'MLMvs自回归'],
        commonMisconceptions: ['认为BERT也能做生成任务', '认为GPT不能做理解任务'],
        relatedConcepts: ['预训练-微调', 'Prompt工程'],
        followUpQuestions: ['什么是预训练-微调范式？', 'GPT的Scaling Law是什么？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c19-1', 'lab-c19-2'],
    assessmentIds: ['assess-c19-pre', 'assess-c19-unit'],
    estimatedHours: 45,
  },
  {
    id: 20,
    objectives: [
      { level: 'L1-认知', description: '理解计算机视觉的基本任务和卷积神经网络架构' },
      { level: 'L2-应用', description: '能够使用迁移学习和目标检测框架解决实际视觉问题' },
      { level: 'L3-综合', description: '综合运用检测、分割和生成模型构建完整的视觉应用系统' },
    ] as BloomObjective[],
    prerequisiteCourses: [18],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c20-1',
        title: '图像数据增强',
        description: '实现常见的图像数据增强方法',
        level: '入门',
        code: `import numpy as np
def flip_horizontal(image):
    return image[:, ::-1]

def random_crop(image, crop_size):
    h, w = image.shape[:2]
    top = np.random.randint(0, h - crop_size)
    left = np.random.randint(0, w - crop_size)
    return image[top:top+crop_size, left:left+crop_size]

def adjust_brightness(image, factor=1.2):
    return np.clip(image * factor, 0, 255).astype(np.uint8)

image = np.random.randint(0, 256, (224, 224, 3), dtype=np.uint8)
flipped = flip_horizontal(image)
cropped = random_crop(image, 200)
bright = adjust_brightness(image, 1.5)
print(f"原图: {image.shape}, 翻转: {flipped.shape}, 裁剪: {cropped.shape}")`,
        output: `原图: (224, 224, 3), 翻转: (224, 224, 3), 裁剪: (200, 200, 3)`,
        commonError: '数据增强过度导致语义改变，或忘记归一化处理',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c20-2',
        title: 'IoU计算',
        description: '实现目标检测中的交并比计算',
        level: '进阶',
        code: `def calculate_iou(box1, box2):
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - intersection
    return intersection / union if union > 0 else 0

box1 = [50, 50, 150, 150]
box2 = [100, 100, 200, 200]
print(f"IoU: {calculate_iou(box1, box2):.4f}")`,
        output: `IoU: 0.1429`,
        commonError: '坐标格式混淆（xyxy vs xywh），或交集为负时未正确处理',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c20-1',
        question: '两阶段检测和一阶段检测的区别是什么？',
        answer: '两阶段检测（Faster R-CNN）先生成候选区域再分类回归，精度高但速度慢；一阶段检测（YOLO/SSD）直接从特征图预测边界框和类别，速度快但精度稍低。YOLOv5/v8在速度和精度间取得了好的平衡。',
        difficulty: '基础',
        keyPoints: ['候选区域vs直接预测', '精度vs速度', 'RPN机制'],
        commonMisconceptions: ['认为一阶段检测精度一定不如两阶段', '认为YOLO不需要锚框'],
        relatedConcepts: ['锚框', 'NMS'],
        followUpQuestions: ['什么是锚框？如何设计？', 'NMS非极大值抑制的原理是什么？'],
      } as FAQItem,
      {
        id: 'faq-c20-2',
        question: 'ResNet的残差连接解决了什么问题？',
        answer: '残差连接让网络学习残差F(x)=H(x)-x而非直接学习H(x)，使梯度可以通过快捷路径直接回传，缓解深层网络的梯度消失问题。实验证明残差网络可以成功训练上百甚至上千层。',
        difficulty: '深入',
        keyPoints: ['恒等映射', '梯度直传', '网络深度突破'],
        commonMisconceptions: ['认为残差连接减少了参数量', '认为残差连接只对极深网络有效'],
        relatedConcepts: ['梯度消失', 'BatchNorm'],
        followUpQuestions: ['为什么学习残差比学习恒等映射更容易？', 'DenseNet和ResNet的残差连接有什么区别？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c20-1', 'lab-c20-2'],
    assessmentIds: ['assess-c20-pre', 'assess-c20-unit'],
    estimatedHours: 45,
  },
  {
    id: 21,
    objectives: [
      { level: 'L1-认知', description: '理解马尔可夫决策过程、强化学习基本框架和生成模型原理' },
      { level: 'L2-应用', description: '能够实现DQN、PPO等深度强化学习算法和GAN生成模型' },
      { level: 'L3-综合', description: '综合运用强化学习和生成式AI技术解决复杂决策与内容生成问题' },
    ] as BloomObjective[],
    prerequisiteCourses: [17],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c21-1',
        title: 'Q-Learning算法',
        description: '实现简单的Q-Learning表格型强化学习',
        level: '进阶',
        code: `import numpy as np
def q_learning(env_size=5, episodes=100, lr=0.1, gamma=0.9, epsilon=0.1):
    Q = np.zeros((env_size, 2))
    for ep in range(episodes):
        state = 0
        while state < env_size - 1:
            if np.random.random() < epsilon:
                action = np.random.randint(2)
            else:
                action = np.argmax(Q[state])
            next_state = min(state + action + 1, env_size - 1)
            reward = 10 if next_state == env_size - 1 else -1
            Q[state, action] += lr * (reward + gamma * np.max(Q[next_state]) - Q[state, action])
            state = next_state
    return Q

Q = q_learning()
print(f"Q表:\\n{Q}")`,
        output: `Q表:
[[ 6.21  7.9 ]
 [ 7.9   9.  ]
 [ 9.    9.  ]
 [ 9.    9.  ]
 [ 0.    0.  ]]`,
        commonError: 'Q值更新公式中混淆max和当前action的Q值，或探索率设置不当',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c21-2',
        title: 'GAN概念演示',
        description: '演示生成对抗网络的核心训练逻辑',
        level: '高级',
        code: `import numpy as np
class SimpleGAN:
    def __init__(self, latent_dim=10):
        self.latent_dim = latent_dim
        self.g_weights = np.random.randn(latent_dim, 1) * 0.1
        self.d_weights = np.random.randn(1, 1) * 0.1
    def generate(self, z):
        return 1 / (1 + np.exp(-(z @ self.g_weights)))
    def discriminate(self, x):
        return 1 / (1 + np.exp(-(x @ self.d_weights)))
    def train_step(self, real_data, lr=0.01):
        z = np.random.randn(1, self.latent_dim)
        fake_data = self.generate(z)
        d_loss_real = -np.log(self.discriminate(real_data) + 1e-8)
        d_loss_fake = -np.log(1 - self.discriminate(fake_data) + 1e-8)
        g_loss = -np.log(self.discriminate(fake_data) + 1e-8)
        return float(d_loss_real + d_loss_fake), float(g_loss)

gan = SimpleGAN()
real = np.array([[0.8]])
d_loss, g_loss = gan.train_step(real)
print(f"D损失: {d_loss:.4f}, G损失: {g_loss:.4f}")`,
        output: `D损失: 0.7111, G损失: 0.7111`,
        commonError: 'GAN训练不稳定导致模式崩溃，或判别器过强导致生成器梯度消失',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c21-1',
        question: '什么是马尔可夫决策过程？',
        answer: 'MDP是强化学习的数学框架，由状态集S、动作集A、转移概率P、奖励函数R和折扣因子γ组成。马尔可夫性质指未来状态只依赖当前状态和动作，与历史无关。',
        difficulty: '基础',
        keyPoints: ['五元组(S,A,P,R,γ)', '马尔可夫性质', '折扣因子'],
        commonMisconceptions: ['认为马尔可夫性质意味着历史完全无用', '混淆MDP和POMDP'],
        relatedConcepts: ['贝尔曼方程', '价值函数'],
        followUpQuestions: ['什么是部分可观测MDP（POMDP）？', '折扣因子γ如何影响策略？'],
      } as FAQItem,
      {
        id: 'faq-c21-2',
        question: 'GAN的生成器和判别器是如何对抗的？',
        answer: '生成器试图生成逼真的假数据欺骗判别器，判别器试图区分真实数据和生成数据。两者在博弈中共同进步：生成器越来越逼真，判别器越来越严格。训练目标是达到纳什均衡。',
        difficulty: '深入',
        keyPoints: ['博弈对抗', '纳什均衡', '模式崩溃'],
        commonMisconceptions: ['认为GAN训练一定能收敛', '认为判别器越强越好'],
        relatedConcepts: ['WGAN', '扩散模型'],
        followUpQuestions: ['什么是模式崩溃？如何缓解？', 'WGAN相比原始GAN有什么改进？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c21-1', 'lab-c21-2'],
    assessmentIds: ['assess-c21-pre', 'assess-c21-unit'],
    estimatedHours: 50,
  },
  {
    id: 22,
    objectives: [
      { level: 'L1-认知', description: '理解图形渲染流水线、三维变换和投影的基本原理' },
      { level: 'L2-应用', description: '能够实现光照模型、纹理映射和曲线曲面算法' },
      { level: 'L3-综合', description: '综合运用着色器编程和光线追踪技术实现高质量图形渲染' },
    ] as BloomObjective[],
    prerequisiteCourses: [1, 5],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c22-1',
        title: '三维变换矩阵',
        description: '实现平移、旋转和投影变换矩阵',
        level: '进阶',
        code: `import numpy as np
def translate(tx, ty, tz):
    M = np.eye(4)
    M[0, 3], M[1, 3], M[2, 3] = tx, ty, tz
    return M

def rotate_y(angle):
    c, s = np.cos(angle), np.sin(angle)
    return np.array([[c,0,s,0],[0,1,0,0],[-s,0,c,0],[0,0,0,1]])

def perspective(fov, aspect, near, far):
    f = 1 / np.tan(fov / 2)
    M = np.zeros((4, 4))
    M[0,0] = f / aspect
    M[1,1] = f
    M[2,2] = (far + near) / (near - far)
    M[2,3] = 2 * far * near / (near - far)
    M[3,2] = -1
    return M

point = np.array([1, 0, 0, 1])
transformed = translate(2, 0, 0) @ rotate_y(np.pi/4) @ point
print(f"变换后: {transformed[:3]}")`,
        output: `变换后: [2.707 0.    -0.707]`,
        commonError: '矩阵乘法顺序错误（应从右到左应用变换），或齐次坐标归一化遗漏',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c22-2',
        title: 'Phong光照模型',
        description: '实现Phong光照模型计算顶点颜色',
        level: '高级',
        code: `import numpy as np
def phong_lighting(position, normal, light_pos, view_pos,
                   ambient=0.1, diffuse_strength=0.7, specular_strength=0.3, shininess=32):
    normal = normal / np.linalg.norm(normal)
    light_dir = (light_pos - position)
    light_dir = light_dir / np.linalg.norm(light_dir)
    view_dir = (view_pos - position)
    view_dir = view_dir / np.linalg.norm(view_dir)
    ambient_color = ambient
    diff = max(np.dot(normal, light_dir), 0)
    diffuse_color = diffuse_strength * diff
    reflect_dir = 2 * np.dot(normal, light_dir) * normal - light_dir
    spec = max(np.dot(view_dir, reflect_dir), 0) ** shininess
    specular_color = specular_strength * spec
    return ambient_color + diffuse_color + specular_color

pos = np.array([0.0, 0.0, 0.0])
n = np.array([0.0, 1.0, 0.0])
intensity = phong_lighting(pos, n, np.array([1,2,1]), np.array([0,1,0]))
print(f"光照强度: {intensity:.4f}")`,
        output: `光照强度: 1.0000`,
        commonError: '法线未归一化导致光照计算错误，或反射向量计算方向错误',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c22-1',
        question: '图形渲染流水线的主要阶段有哪些？',
        answer: '主要阶段：应用阶段（CPU准备数据）→几何阶段（顶点变换、裁剪、投影）→光栅化阶段（三角形→片元）→片元处理阶段（着色、纹理映射）→输出合并阶段（深度测试、混合）。',
        difficulty: '基础',
        keyPoints: ['几何处理', '光栅化', '片元着色'],
        commonMisconceptions: ['认为渲染流水线是纯软件过程', '混淆顶点着色器和片元着色器的职责'],
        relatedConcepts: ['GPU架构', '着色器编程'],
        followUpQuestions: ['顶点着色器和片元着色器各负责什么？', '什么是几何着色器？'],
      } as FAQItem,
      {
        id: 'faq-c22-2',
        question: '光线追踪和光栅化渲染的区别是什么？',
        answer: '光栅化将三角形投影到屏幕逐像素着色，速度快但难以处理全局光照效果；光线追踪从相机发射光线与场景求交，能自然模拟反射、折射和阴影等全局光照，但计算量大。实时光线追踪是当前研究热点。',
        difficulty: '深入',
        keyPoints: ['光栅化速度快', '光线追踪全局光照', '混合渲染'],
        commonMisconceptions: ['认为光线追踪完全取代光栅化', '认为光线追踪只能离线渲染'],
        relatedConcepts: ['路径追踪', 'BVH加速结构'],
        followUpQuestions: ['如何加速光线追踪？', '什么是路径追踪？和光线追踪有什么区别？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c22-1', 'lab-c22-2'],
    assessmentIds: ['assess-c22-pre', 'assess-c22-unit'],
    estimatedHours: 45,
  },
  {
    id: 23,
    objectives: [
      { level: 'L1-认知', description: '理解信息安全CIA三要素、密码学基础和常见安全威胁' },
      { level: 'L2-应用', description: '能够分析Web安全漏洞并设计防御方案，理解加密算法的应用' },
      { level: 'L3-综合', description: '综合运用密码学、认证和隐私保护技术构建安全系统架构' },
    ] as BloomObjective[],
    prerequisiteCourses: [10],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c23-1',
        title: 'RSA加密演示',
        description: '简化版RSA加密解密过程演示',
        level: '进阶',
        code: `import random
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

def simple_rsa_demo():
    p, q = 61, 53
    n = p * q
    phi = (p - 1) * (q - 1)
    e = 17
    d = pow(e, -1, phi)
    message = 42
    encrypted = pow(message, e, n)
    decrypted = pow(encrypted, d, n)
    print(f"公钥: (e={e}, n={n})")
    print(f"私钥: (d={d}, n={n})")
    print(f"明文: {message}, 密文: {encrypted}, 解密: {decrypted}")

simple_rsa_demo()`,
        output: `公钥: (e=17, n=3233)
私钥: (d=2753, n=3233)
明文: 42, 密文: 2557, 解密: 42`,
        commonError: '实际RSA需要大素数和填充方案，简化版存在安全漏洞',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c23-2',
        title: 'SQL注入防御',
        description: '演示参数化查询防御SQL注入',
        level: '进阶',
        code: `def unsafe_query(username, password):
    query = f"SELECT * FROM users WHERE name='{username}' AND pass='{password}'"
    return query

def safe_query(username, password):
    query = "SELECT * FROM users WHERE name=? AND pass=?"
    params = (username, password)
    return query, params

malicious_input = "admin' OR '1'='1"
print(f"不安全: {unsafe_query(malicious_input, 'x')}")
print(f"安全: {safe_query(malicious_input, 'x')}")`,
        output: `不安全: SELECT * FROM users WHERE name='admin' OR '1'='1' AND pass='x'
安全: ('SELECT * FROM users WHERE name=? AND pass=?', ("admin' OR '1'='1", 'x'))`,
        commonError: '仅靠转义特殊字符不够安全，应始终使用参数化查询',
        language: 'python',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c23-1',
        question: '对称加密和非对称加密的区别是什么？',
        answer: '对称加密使用同一密钥加密解密，速度快适合大量数据（AES）；非对称加密使用公钥加密私钥解密，速度慢但解决密钥分发问题（RSA）。实际中常混合使用：非对称传密钥，对称传数据。',
        difficulty: '基础',
        keyPoints: ['密钥数量不同', '速度差异', '混合加密方案'],
        commonMisconceptions: ['认为非对称加密一定比对称更安全', '认为HTTPS只用非对称加密'],
        relatedConcepts: ['HTTPS', '数字签名'],
        followUpQuestions: ['HTTPS的加密过程是怎样的？', '什么是混合加密？'],
      } as FAQItem,
      {
        id: 'faq-c23-2',
        question: '什么是XSS和CSRF攻击？如何防御？',
        answer: 'XSS是注入恶意脚本到网页，在其他用户浏览器执行；CSRF是利用用户已登录的身份发起伪造请求。XSS防御：输入过滤、输出编码、CSP策略；CSRF防御：CSRF Token、SameSite Cookie、验证Referer。',
        difficulty: '深入',
        keyPoints: ['XSS注入脚本', 'CSRF伪造请求', '各自防御策略'],
        commonMisconceptions: ['认为HTTPS能防止XSS', '认为CSRF只能GET请求触发'],
        relatedConcepts: ['CSP', 'SameSite Cookie'],
        followUpQuestions: ['存储型XSS和反射型XSS有什么区别？', 'CSP如何防止XSS攻击？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c23-1', 'lab-c23-2'],
    assessmentIds: ['assess-c23-pre', 'assess-c23-unit'],
    estimatedHours: 35,
  },
  {
    id: 24,
    objectives: [
      { level: 'L1-认知', description: '理解大数据5V特征、Hadoop生态体系和云计算服务模型' },
      { level: 'L2-应用', description: '能够使用Spark进行分布式数据处理，使用Docker容器化部署应用' },
      { level: 'L3-综合', description: '综合运用流式计算、容器编排和云原生技术设计大数据平台架构' },
    ] as BloomObjective[],
    prerequisiteCourses: [11],
    successorCourses: [],
    codeExamples: [
      {
        id: 'code-c24-1',
        title: 'MapReduce词频统计',
        description: '实现MapReduce模式的词频统计',
        level: '进阶',
        code: `from collections import defaultdict
def map_function(document):
    results = []
    for word in document.lower().split():
        word = word.strip('.,!?;:()[]{}')
        if word:
            results.append((word, 1))
    return results

def reduce_function(pairs):
    counts = defaultdict(int)
    for word, count in pairs:
        counts[word] += count
    return dict(sorted(counts.items(), key=lambda x: -x[1]))

documents = ["hello world hello", "world of big data", "hello big data"]
all_pairs = []
for doc in documents:
    all_pairs.extend(map_function(doc))
result = reduce_function(all_pairs)
print(result)`,
        output: `{'hello': 3, 'world': 2, 'big': 2, 'data': 2, 'of': 1}`,
        commonError: 'Map阶段未正确分词或归一化，或Reduce阶段未处理数据倾斜',
        language: 'python',
      } as CodeExampleV2,
      {
        id: 'code-c24-2',
        title: 'Docker容器化部署',
        description: 'Dockerfile和容器编排配置示例',
        level: '进阶',
        code: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
        output: `✓ 镜像构建成功: myapp:v1.0
✓ 容器启动: http://localhost:8000
✓ 健康检查通过`,
        commonError: 'Dockerfile指令顺序不当导致缓存失效，或忘记设置非root用户运行',
        language: 'dockerfile',
      } as CodeExampleV2,
    ],
    faqItems: [
      {
        id: 'faq-c24-1',
        question: 'Spark相比MapReduce有哪些优势？',
        answer: 'Spark基于内存计算，中间结果缓存在内存中避免频繁磁盘I/O；支持DAG任务调度减少中间结果落盘；提供丰富的API（RDD/DataFrame/SQL/MLlib）；迭代计算性能比MapReduce快10-100倍。',
        difficulty: '基础',
        keyPoints: ['内存计算', 'DAG调度', '丰富API'],
        commonMisconceptions: ['认为Spark完全不需要磁盘', '认为Spark替代了Hadoop的所有组件'],
        relatedConcepts: ['RDD', 'DataFrame'],
        followUpQuestions: ['什么是RDD？和DataFrame有什么区别？', 'Spark如何处理内存不足的情况？'],
      } as FAQItem,
      {
        id: 'faq-c24-2',
        question: 'Docker和虚拟机有什么区别？',
        answer: '虚拟机包含完整操作系统，通过Hypervisor虚拟化硬件，隔离性强但开销大；Docker容器共享宿主内核，通过命名空间和控制组实现隔离，启动快、资源占用少。容器更轻量但隔离性弱于虚拟机。',
        difficulty: '基础',
        keyPoints: ['共享内核vs独立内核', '轻量级隔离', '启动速度差异'],
        commonMisconceptions: ['认为Docker容器完全安全', '认为Docker能替代所有虚拟机场景'],
        relatedConcepts: ['Kubernetes', '容器安全'],
        followUpQuestions: ['Kubernetes如何管理Docker容器？', '容器的安全风险有哪些？'],
      } as FAQItem,
    ],
    labTaskIds: ['lab-c24-1', 'lab-c24-2'],
    assessmentIds: ['assess-c24-pre', 'assess-c24-unit'],
    estimatedHours: 45,
  },
]

export const knowledgeCrossRefs: KnowledgeCrossRef[] = [
  {
    knowledgePointName: '指针与链表',
    sourceCourseId: 1,
    targetCourseId: 5,
    relationDescription: 'C语言的指针是链表节点链接的底层机制，理解指针操作是掌握链表实现的基础',
  },
  {
    knowledgePointName: 'B+树与索引',
    sourceCourseId: 5,
    targetCourseId: 11,
    relationDescription: '数据结构中的B+树是数据库索引的核心实现结构，B+树的特性直接决定了数据库查询性能',
  },
  {
    knowledgePointName: '抽象语法树与语法分析',
    sourceCourseId: 5,
    targetCourseId: 7,
    relationDescription: '数据结构中的树结构是编译原理语法分析的基础，AST（抽象语法树）是编译器中间表示的核心数据结构',
  },
  {
    knowledgePointName: '面向对象范式迁移',
    sourceCourseId: 2,
    targetCourseId: 3,
    relationDescription: 'Python的面向对象特性为Java OOP提供了概念基础，从动态类型的OOP过渡到静态类型的OOP加深对面向对象本质的理解',
  },
  {
    knowledgePointName: '贝叶斯公式与贝叶斯分类',
    sourceCourseId: 15,
    targetCourseId: 17,
    relationDescription: '概率论中的贝叶斯公式是朴素贝叶斯分类器的数学基础，后验概率计算直接应用于分类决策',
  },
  {
    knowledgePointName: '图论与网络路由',
    sourceCourseId: 14,
    targetCourseId: 10,
    relationDescription: '离散数学中的图论是计算机网络路由算法的理论基础，最短路径算法直接应用于网络路由选择',
  },
  {
    knowledgePointName: '进程调度与CPU流水线',
    sourceCourseId: 9,
    targetCourseId: 8,
    relationDescription: '操作系统的进程调度策略与计算机组成原理的CPU流水线设计密切相关，理解硬件调度机制有助于优化OS调度算法',
  },
  {
    knowledgePointName: '矩阵运算与神经网络',
    sourceCourseId: 15,
    targetCourseId: 18,
    relationDescription: '概率统计中的矩阵运算和梯度计算是深度学习反向传播算法的数学基础，线性代数和微积分知识直接应用于神经网络训练',
  },
  {
    knowledgePointName: '散列表与密码学哈希',
    sourceCourseId: 5,
    targetCourseId: 23,
    relationDescription: '数据结构中的散列函数与信息安全中的密码学哈希函数共享数学原理，但安全哈希需要抗碰撞性等额外要求',
  },
  {
    knowledgePointName: '排序算法与MapReduce',
    sourceCourseId: 6,
    targetCourseId: 24,
    relationDescription: '算法中的归并排序思想是MapReduce框架的理论原型，分治-合并策略在大规模分布式计算中广泛应用',
  },
  {
    knowledgePointName: 'HTTP协议与Web安全',
    sourceCourseId: 10,
    targetCourseId: 23,
    relationDescription: '计算机网络的HTTP协议是Web安全攻击的主要载体，理解HTTP请求响应机制是防御XSS、CSRF等攻击的前提',
  },
  {
    knowledgePointName: '关系代数与SQL',
    sourceCourseId: 14,
    targetCourseId: 11,
    relationDescription: '离散数学中的关系代数是数据库SQL查询的理论基础，选择、投影、连接等关系运算直接对应SQL语法',
  },
  {
    knowledgePointName: '决策树与信息熵',
    sourceCourseId: 17,
    targetCourseId: 15,
    relationDescription: '机器学习中决策树的信息增益基于概率论中的信息熵概念，信息论是特征选择和模型评估的理论支撑',
  },
  {
    knowledgePointName: 'Transformer与GPU并行',
    sourceCourseId: 19,
    targetCourseId: 8,
    relationDescription: 'NLP中Transformer的矩阵运算高度依赖GPU并行计算能力，理解计算机组成原理中的GPU架构有助于优化模型训练效率',
  },
  {
    knowledgePointName: '软件测试与CI/CD',
    sourceCourseId: 13,
    targetCourseId: 12,
    relationDescription: '软件测试的自动化测试是DevOps和CI/CD流水线的核心环节，测试驱动开发与持续集成实践紧密配合',
  },
]
