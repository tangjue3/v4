import type { Course, Galaxy } from '../types'

export const galaxies: Galaxy[] = [
  { id: 'programming', name: '编程与算法基础', color: '#4FC3F7', planetIds: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'systems', name: '计算机系统', color: '#81C784', planetIds: [8, 9, 10, 11] },
  { id: 'software', name: '软件工程', color: '#FFB74D', planetIds: [12, 13] },
  { id: 'ai', name: '人工智能方向', color: '#BA68C8', planetIds: [14, 15, 16, 17, 18, 19, 20, 21] },
  { id: 'frontier', name: '前沿与应用', color: '#E57373', planetIds: [22, 23, 24] },
]

export const courses: Course[] = [
  {
    id: 1, name: 'C语言程序设计', direction: 'programming', difficulty: '入门', prerequisites: [], themeColor: '#00599C',
    description: '学习C语言基础语法、指针、内存管理，打下坚实的编程基础。',
    knowledgePoints: [
      { name: '基本语法', description: '数据类型、运算符、表达式、输入输出', difficulty: '入门' },
      { name: '流程控制', description: 'if-else、switch、for、while、do-while', difficulty: '入门' },
      { name: '函数', description: '函数定义与调用、参数传递、递归', difficulty: '入门' },
      { name: '数组与字符串', description: '一维/二维数组、字符数组与字符串处理', difficulty: '入门' },
      { name: '指针', description: '指针概念、指针运算、指针与数组、函数指针', difficulty: '进阶' },
      { name: '结构体与共用体', description: '结构体定义、嵌套、联合体、枚举', difficulty: '进阶' },
      { name: '动态内存管理', description: 'malloc、calloc、realloc、free', difficulty: '进阶' },
      { name: '文件操作', description: '文件打开/关闭、读写操作、二进制文件', difficulty: '进阶' },
    ],
    codeExample: `#include <stdio.h>
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
void swap(int *a, int *b) {
    int temp = *a; *a = *b; *b = temp;
}`,
    faq: ['指针和数组有什么区别和联系？', '什么是野指针？如何避免？', 'malloc 和 calloc 有什么区别？', 'static 关键字在 C 语言中有哪些作用？'],
  },
  {
    id: 2, name: 'Python程序设计', direction: 'programming', difficulty: '入门', prerequisites: [], themeColor: '#3776AB',
    description: '掌握Python语法、函数式编程、面向对象，快速上手现代编程语言。',
    knowledgePoints: [
      { name: '基础语法', description: '变量、数据类型、运算符、输入输出', difficulty: '入门' },
      { name: '流程控制', description: 'if-elif-else、for、while、break、continue', difficulty: '入门' },
      { name: '数据结构', description: '列表、元组、字典、集合、推导式', difficulty: '入门' },
      { name: '函数', description: '函数定义、参数类型、lambda、装饰器', difficulty: '入门' },
      { name: '文件与异常', description: '文件读写、with 语句、异常处理', difficulty: '入门' },
      { name: '面向对象', description: '类与对象、继承、多态、特殊方法', difficulty: '进阶' },
      { name: '高级特性', description: '生成器、迭代器、上下文管理器、闭包', difficulty: '进阶' },
    ],
    codeExample: `def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} 耗时: {time.time() - start:.4f}s")
        return result
    return wrapper

def fibonacci_gen(n):
    a, b = 0, 1
    for _ in range(n):
        yield a; a, b = b, a + b`,
    faq: ['Python 中列表和元组的区别是什么？', '什么是列表推导式？有什么优点？', '生成器和迭代器有什么区别？', 'Python 的 GIL 是什么？对多线程有什么影响？'],
  },
  {
    id: 3, name: '面向对象程序设计（Java）', direction: 'programming', difficulty: '进阶', prerequisites: [1, 2], themeColor: '#ED8B00',
    description: '深入理解OOP四大特性，掌握Java集合框架、多线程与Stream API。',
    knowledgePoints: [
      { name: '类与对象', description: '类的定义、对象创建、构造方法、this 关键字', difficulty: '入门' },
      { name: '封装', description: '访问修饰符、getter/setter、包机制', difficulty: '入门' },
      { name: '继承', description: 'extends、super、方法重写、final 关键字', difficulty: '进阶' },
      { name: '多态', description: '方法重载、动态绑定、抽象类、接口', difficulty: '进阶' },
      { name: '异常处理', description: 'try-catch-finally、自定义异常、throws', difficulty: '入门' },
      { name: '泛型', description: '泛型类、泛型方法、类型通配符', difficulty: '进阶' },
      { name: '集合框架', description: 'List、Set、Map、Collections 工具类', difficulty: '进阶' },
      { name: '多线程', description: 'Thread、Runnable、synchronized、线程池', difficulty: '高级' },
      { name: 'Lambda与Stream', description: '函数式接口、Stream API、Optional', difficulty: '高级' },
    ],
    faq: ['Java 中 == 和 equals() 有什么区别？', '接口和抽象类有什么区别？如何选择？', 'HashMap 的底层实现原理是什么？', 'synchronized 和 volatile 关键字的区别？'],
  },
  {
    id: 4, name: '面向对象程序设计（C++）', direction: 'programming', difficulty: '进阶', prerequisites: [1], themeColor: '#00599C',
    description: '掌握C++面向对象、模板元编程、STL与智能指针，理解RAII与移动语义。',
    knowledgePoints: [
      { name: '类与对象', description: '类的定义、构造函数/析构函数、拷贝构造', difficulty: '入门' },
      { name: '继承与派生', description: '继承方式、多继承、虚继承、菱形继承', difficulty: '进阶' },
      { name: '多态', description: '虚函数、纯虚函数、抽象类、虚函数表', difficulty: '进阶' },
      { name: '模板', description: '函数模板、类模板、模板特化', difficulty: '进阶' },
      { name: 'STL 容器', description: 'vector、list、map、set、unordered_map', difficulty: '进阶' },
      { name: '智能指针', description: 'unique_ptr、shared_ptr、weak_ptr', difficulty: '高级' },
      { name: '移动语义', description: '右值引用、move 语义、完美转发', difficulty: '高级' },
    ],
    faq: ['C++ 中虚函数是如何实现的？虚函数表是什么？', '智能指针的原理是什么？', '什么是 RAII？在 C++ 中如何应用？', '左值引用和右值引用的区别是什么？'],
  },
  {
    id: 5, name: '数据结构', direction: 'programming', difficulty: '进阶', prerequisites: [1], themeColor: '#4CAF50',
    description: '系统学习线性表、树、图、散列表等核心数据结构，理解时空复杂度分析。',
    knowledgePoints: [
      { name: '线性表', description: '顺序表、链表（单链表、双链表、循环链表）', difficulty: '入门' },
      { name: '栈与队列', description: '顺序栈、链栈、循环队列、双端队列', difficulty: '入门' },
      { name: '树与二叉树', description: '二叉树遍历、线索二叉树、哈夫曼树、BST', difficulty: '进阶' },
      { name: '堆', description: '最大堆、最小堆、堆排序、优先队列', difficulty: '进阶' },
      { name: '图', description: '邻接矩阵/表、DFS、BFS、最短路径、最小生成树', difficulty: '高级' },
      { name: '散列表', description: '哈希函数、冲突解决', difficulty: '进阶' },
      { name: '平衡树', description: 'AVL 树、红黑树、B 树、B+ 树', difficulty: '高级' },
    ],
    codeExample: `def build_lps(pattern):
    lps = [0] * len(pattern); length = 0; i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1; lps[i] = length; i += 1
        elif length != 0: length = lps[length - 1]
        else: lps[i] = 0; i += 1
    return lps`,
    faq: ['链表和数组各自的优缺点是什么？', '什么是时间复杂度和空间复杂度？', '哈希表如何解决冲突？', 'B+ 树相比 B 树有哪些优势？'],
  },
  {
    id: 6, name: '算法设计与分析', direction: 'programming', difficulty: '高级', prerequisites: [5], themeColor: '#FF5722',
    description: '掌握递归分治、动态规划、贪心、回溯等经典算法范式与NP完全理论。',
    knowledgePoints: [
      { name: '算法复杂度', description: '大 O 表示法、渐进分析、摊还分析', difficulty: '进阶' },
      { name: '递归与分治', description: '二分搜索、归并排序、快速排序', difficulty: '进阶' },
      { name: '动态规划', description: '背包问题、LCS、最短路径、矩阵连乘', difficulty: '高级' },
      { name: '贪心算法', description: '活动选择、哈夫曼编码、最小生成树', difficulty: '进阶' },
      { name: '回溯法', description: '八皇后、数独、子集和、图着色', difficulty: '高级' },
      { name: '图算法', description: '拓扑排序、强连通分量、最大流', difficulty: '高级' },
      { name: 'NP 完全理论', description: 'P 与 NP、NP 完全、归约证明', difficulty: '高级' },
    ],
    codeExample: `def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w - weights[i-1]], dp[i-1][w])
            else: dp[i][w] = dp[i-1][w]
    return dp[n][capacity]`,
    faq: ['动态规划和分治算法的区别是什么？', '什么情况下适合使用贪心算法？', 'P 类和 NP 类问题的本质区别是什么？'],
  },
  {
    id: 7, name: '编译原理', direction: 'programming', difficulty: '高级', prerequisites: [1, 5], themeColor: '#9C27B0',
    description: '理解编译器全流程：词法分析、语法分析、语义分析、中间代码生成与优化。',
    knowledgePoints: [
      { name: '编译过程概述', description: '词法分析→语法分析→语义分析→代码生成→优化', difficulty: '入门' },
      { name: '词法分析', description: '正则表达式、有限自动机（NFA/DFA）', difficulty: '进阶' },
      { name: '语法分析', description: '上下文无关文法、LL(1)、LR分析器', difficulty: '高级' },
      { name: '语义分析', description: '属性文法、语法制导翻译、类型检查', difficulty: '高级' },
      { name: '中间代码', description: '三地址码、抽象语法树、DAG 表示', difficulty: '进阶' },
      { name: '代码优化', description: '常量折叠、公共子表达式消除、循环优化', difficulty: '高级' },
    ],
    faq: ['编译器和解释器的区别是什么？', 'LL(1) 和 LR(1) 分析器各自的特点是什么？', 'NFA 和 DFA 的关系是什么？'],
  },
  {
    id: 8, name: '计算机组成原理', direction: 'systems', difficulty: '进阶', prerequisites: [1], themeColor: '#607D8B',
    description: '理解计算机硬件体系：冯·诺依曼结构、CPU数据通路、存储层次、指令系统。',
    knowledgePoints: [
      { name: '计算机系统概论', description: '冯·诺依曼结构、计算机层次结构、性能指标', difficulty: '入门' },
      { name: '数据表示', description: '原码/反码/补码、浮点数 IEEE754', difficulty: '进阶' },
      { name: '运算器', description: '定点加减乘除、浮点运算、ALU 原理', difficulty: '进阶' },
      { name: '存储系统', description: '存储器层次结构、Cache、虚拟存储器', difficulty: '进阶' },
      { name: '指令系统', description: '指令格式、寻址方式、CISC 与 RISC', difficulty: '进阶' },
      { name: '中央处理器', description: 'CPU 数据通路、流水线、冒险处理', difficulty: '高级' },
      { name: 'I/O系统', description: 'I/O 接口、中断机制、DMA', difficulty: '进阶' },
    ],
    faq: ['冯·诺依曼结构的核心思想是什么？', 'Cache 的写策略有哪些？', '什么是流水线冒险？有哪些解决方式？', 'CISC 和 RISC 的主要区别是什么？'],
  },
  {
    id: 9, name: '操作系统', direction: 'systems', difficulty: '进阶', prerequisites: [1, 8], themeColor: '#1565C0',
    description: '学习进程线程管理、内存管理、文件系统、同步互斥与死锁处理。',
    knowledgePoints: [
      { name: '进程与线程', description: '进程状态、PCB、线程模型、进程通信', difficulty: '进阶' },
      { name: 'CPU 调度', description: 'FCFS/SJF/RR/优先级/多级队列调度算法', difficulty: '进阶' },
      { name: '同步与互斥', description: '临界区、信号量、管程、生产者消费者', difficulty: '高级' },
      { name: '死锁', description: '死锁条件、预防/避免/检测/解除、银行家算法', difficulty: '进阶' },
      { name: '内存管理', description: '分页、分段、段页式、TLB、页面置换', difficulty: '进阶' },
      { name: '文件系统', description: '文件结构、目录实现、磁盘调度', difficulty: '进阶' },
    ],
    codeExample: `class BoundedBuffer:
    def __init__(self, capacity=5):
        self.buffer = []
        self.mutex = threading.Semaphore(1)
        self.empty = threading.Semaphore(capacity)
        self.full = threading.Semaphore(0)
    def produce(self, item):
        self.empty.acquire(); self.mutex.acquire()
        self.buffer.append(item)
        self.mutex.release(); self.full.release()
    def consume(self):
        self.full.acquire(); self.mutex.acquire()
        item = self.buffer.pop(0)
        self.mutex.release(); self.empty.release()
        return item`,
    faq: ['进程和线程有什么区别？', '什么是死锁？产生死锁的四个必要条件是什么？', '虚拟内存是如何实现的？', '进程间通信的方式有哪些？'],
  },
  {
    id: 10, name: '计算机网络', direction: 'systems', difficulty: '进阶', prerequisites: [8], themeColor: '#0277BD',
    description: '掌握TCP/IP协议栈、路由算法、TCP拥塞控制、应用层协议与网络安全基础。',
    knowledgePoints: [
      { name: '网络体系结构', description: 'OSI 七层模型、TCP/IP 四层模型', difficulty: '入门' },
      { name: '数据链路层', description: '差错检测(CRC)、流量控制、CSMA/CD', difficulty: '进阶' },
      { name: '网络层', description: 'IP 协议、子网划分、CIDR、RIP/OSPF/BGP', difficulty: '进阶' },
      { name: '传输层', description: 'TCP/UDP、拥塞控制、三次握手四次挥手', difficulty: '进阶' },
      { name: '应用层', description: 'HTTP/HTTPS、DNS、SMTP、FTP', difficulty: '进阶' },
      { name: '网络安全', description: '对称/非对称加密、SSL/TLS、防火墙', difficulty: '高级' },
    ],
    codeExample: `import socket
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('0.0.0.0', 8888))
server.listen(5)
while True:
    client, addr = server.accept()
    data = client.recv(1024)
    client.send(f"Echo: {data.decode()}".encode())
    client.close()`,
    faq: ['TCP 三次握手和四次挥手的过程是什么？', 'TCP 拥塞控制的算法有哪些？', 'HTTP 和 HTTPS 的区别是什么？', '从输入 URL 到页面显示，中间经历了什么？'],
  },
  {
    id: 11, name: '数据库系统原理', direction: 'systems', difficulty: '进阶', prerequisites: [5], themeColor: '#336791',
    description: '学习关系模型、SQL、范式设计、索引存储、事务管理与NoSQL基础。',
    knowledgePoints: [
      { name: '关系模型', description: '关系代数、元组关系演算、关系完整性', difficulty: '入门' },
      { name: 'SQL 语言', description: 'DDL/DML/DCL、嵌套查询、连接查询、视图', difficulty: '进阶' },
      { name: '数据库设计', description: '函数依赖、范式（1NF~BCNF）、模式分解', difficulty: '进阶' },
      { name: '索引与存储', description: 'B+ 树索引、哈希索引、聚簇索引', difficulty: '进阶' },
      { name: '事务管理', description: 'ACID 特性、并发控制、隔离级别', difficulty: '高级' },
      { name: 'NoSQL', description: '键值数据库、文档数据库、图数据库', difficulty: '进阶' },
    ],
    codeExample: `CREATE TABLE Student (
    sno CHAR(10) PRIMARY KEY,
    sname VARCHAR(20) NOT NULL,
    sdept VARCHAR(30)
);
SELECT s.sname, sc.grade
FROM Student s
JOIN SC sc ON s.sno = sc.sno
WHERE sc.grade >= 90
ORDER BY sc.grade DESC;`,
    faq: ['什么是事务？ACID 特性分别是什么？', '什么是数据库范式？为什么要规范化？', 'B+ 树索引的优缺点是什么？', 'SQL 中 JOIN 的几种类型有什么区别？'],
  },
  {
    id: 12, name: '软件工程', direction: 'software', difficulty: '进阶', prerequisites: [2], themeColor: '#FF6F00',
    description: '掌握软件生命周期、需求工程、架构设计、UML建模、DevOps与CI/CD。',
    knowledgePoints: [
      { name: '软件工程概述', description: '软件危机、生命周期、过程模型（瀑布/敏捷/迭代）', difficulty: '入门' },
      { name: '需求工程', description: '需求获取、需求分析、需求规格说明、验证', difficulty: '进阶' },
      { name: '系统设计', description: '模块化设计、高内聚低耦合、设计模式', difficulty: '进阶' },
      { name: '架构设计', description: 'MVC/MVVM、微服务、分层架构', difficulty: '进阶' },
      { name: 'UML 建模', description: '类图、时序图、用例图、状态图', difficulty: '进阶' },
      { name: '软件测试', description: '单元测试、集成测试、系统测试', difficulty: '进阶' },
      { name: 'DevOps', description: 'CI/CD、持续交付、基础设施即代码', difficulty: '高级' },
    ],
    faq: ['瀑布模型和敏捷开发的核心区别是什么？', '什么是高内聚低耦合？为什么重要？', 'MVC 和 MVVM 架构模式的区别是什么？'],
  },
  {
    id: 13, name: '软件测试', direction: 'software', difficulty: '进阶', prerequisites: [12], themeColor: '#D32F2F',
    description: '学习黑盒/白盒测试方法、单元测试框架、自动化测试与性能测试。',
    knowledgePoints: [
      { name: '测试基础', description: '测试目标、测试原则、测试级别、测试类型', difficulty: '入门' },
      { name: '黑盒测试', description: '等价类划分、边界值分析、决策表、正交实验', difficulty: '进阶' },
      { name: '白盒测试', description: '语句覆盖、分支覆盖、路径覆盖', difficulty: '进阶' },
      { name: '单元测试', description: 'JUnit/PyTest、Mock 对象、TDD', difficulty: '进阶' },
      { name: '自动化测试', description: 'Selenium、Appium、数据驱动测试', difficulty: '高级' },
      { name: '性能测试', description: '负载测试、压力测试、JMeter', difficulty: '高级' },
    ],
    codeExample: `import pytest
def is_valid_phone(phone: str) -> bool:
    if not phone or len(phone) != 11: return False
    if not phone.isdigit(): return False
    return phone.startswith(('13','14','15','17','18','19'))

class TestPhoneValidation:
    def test_valid_phone(self):
        assert is_valid_phone("13812345678") == True
    def test_invalid_length(self):
        assert is_valid_phone("1234567890") == False`,
    faq: ['黑盒测试和白盒测试的区别是什么？', '什么是 TDD？它的流程是什么？', '单元测试、集成测试和系统测试有什么区别？'],
  },
  {
    id: 14, name: '离散数学', direction: 'ai', difficulty: '进阶', prerequisites: [], themeColor: '#8E24AA',
    description: '学习数理逻辑、集合论、图论、代数系统与组合数学，为AI算法打下数学基础。',
    knowledgePoints: [
      { name: '数理逻辑', description: '命题逻辑、谓词逻辑、逻辑等价与推理规则', difficulty: '进阶' },
      { name: '集合论', description: '集合运算、关系（等价/偏序）、函数映射', difficulty: '入门' },
      { name: '图论', description: '欧拉图/哈密顿图、树、匹配、网络流', difficulty: '进阶' },
      { name: '代数系统', description: '群/环/域、布尔代数、格', difficulty: '高级' },
      { name: '组合数学', description: '排列组合、生成函数、容斥原理、鸽巢原理', difficulty: '进阶' },
    ],
    faq: ['命题逻辑和谓词逻辑的区别是什么？', '什么是欧拉路径和哈密顿路径？', '等价关系和偏序关系的定义和区别是什么？'],
  },
  {
    id: 15, name: '概率论与数理统计', direction: 'ai', difficulty: '进阶', prerequisites: [], themeColor: '#00897B',
    description: '掌握概率基础、随机变量、假设检验与回归分析，构建数据分析能力。',
    knowledgePoints: [
      { name: '概率基础', description: '样本空间、事件概率、条件概率、贝叶斯公式', difficulty: '入门' },
      { name: '随机变量', description: '离散/连续型分布、期望、方差', difficulty: '进阶' },
      { name: '大数定律', description: '切比雪夫不等式、LLN、CLT', difficulty: '高级' },
      { name: '参数估计', description: '点估计（矩估计/MLE）、区间估计', difficulty: '进阶' },
      { name: '假设检验', description: '显著性水平、t 检验、卡方检验、p 值', difficulty: '进阶' },
      { name: '回归分析', description: '线性回归、多元回归、逻辑回归', difficulty: '进阶' },
    ],
    faq: ['条件概率和贝叶斯公式的核心思想是什么？', '什么是最大似然估计（MLE）？', '第一类错误和第二类错误的区别是什么？'],
  },
  {
    id: 16, name: '人工智能导论', direction: 'ai', difficulty: '入门', prerequisites: [2], themeColor: '#00BCD4',
    description: '了解AI发展史、搜索算法、知识表示、神经网络入门与AI伦理。',
    knowledgePoints: [
      { name: 'AI 概述', description: 'AI 定义与目标、图灵测试、AI 发展简史', difficulty: '入门' },
      { name: '问题求解', description: '状态空间搜索、BFS/DFS、启发式搜索(A*)', difficulty: '进阶' },
      { name: '知识与推理', description: '谓词逻辑表示、产生式规则、语义网络', difficulty: '进阶' },
      { name: '机器学习入门', description: '监督/无监督/强化学习概述', difficulty: '入门' },
      { name: '神经网络基础', description: '感知机、前馈网络、激活函数、反向传播', difficulty: '进阶' },
      { name: 'AI 伦理', description: 'AI 安全、偏见与公平、可解释性', difficulty: '入门' },
    ],
    codeExample: `import heapq
def a_star_search(start, goal, heuristic, neighbors):
    open_set = [(0 + heuristic(start, goal), 0, start, [start])]
    closed_set = set()
    while open_set:
        f, g, current, path = heapq.heappop(open_set)
        if current == goal: return path, g
        if current in closed_set: continue
        closed_set.add(current)
        for neighbor, cost in neighbors(current):
            if neighbor not in closed_set:
                new_g = g + cost
                heapq.heappush(open_set, (new_g + heuristic(neighbor, goal), new_g, neighbor, path + [neighbor]))
    return None, float('inf')`,
    faq: ['什么是图灵测试？它有什么意义和局限性？', '人工智能、机器学习和深度学习之间的关系是什么？'],
  },
  {
    id: 17, name: '机器学习', direction: 'ai', difficulty: '进阶', prerequisites: [2, 15, 16], themeColor: '#00d4ff',
    description: '系统学习监督学习、无监督学习算法，掌握特征工程、模型评估与调优。',
    knowledgePoints: [
      { name: 'ML概述', description: '学习范式分类、ML流程：数据→特征→训练→评估→部署', difficulty: '入门' },
      { name: 'K-近邻', description: '距离度量、K值选择、KD树优化', difficulty: '入门' },
      { name: '决策树', description: 'ID3/C4.5/CART、信息增益、剪枝', difficulty: '进阶' },
      { name: 'SVM', description: '最大间隔、核函数、软间隔', difficulty: '进阶' },
      { name: '集成学习', description: '随机森林、XGBoost、Bagging/Boosting', difficulty: '进阶' },
      { name: '聚类', description: 'K-Means、DBSCAN、层次聚类', difficulty: '进阶' },
      { name: 'PCA降维', description: '协方差矩阵、特征值分解、主成分', difficulty: '进阶' },
    ],
    codeExample: `import numpy as np
class KNN:
    def __init__(self, k=3):
        self.k = k
    def fit(self, X, y):
        self.X_train = X; self.y_train = y
    def predict(self, X):
        predictions = []
        for x in X:
            distances = np.sqrt(np.sum((self.X_train - x) ** 2, axis=1))
            k_indices = np.argsort(distances)[:self.k]
            k_labels = self.y_train[k_indices]
            predictions.append(np.bincount(k_labels).argmax())
        return np.array(predictions)`,
    faq: ['监督学习和无监督学习的区别是什么？', '什么是过拟合？如何防止？', '偏差和方差的权衡是什么？'],
  },
  {
    id: 18, name: '深度学习', direction: 'ai', difficulty: '进阶', prerequisites: [17], themeColor: '#7c3aed',
    description: '学习神经网络、CNN、RNN/LSTM、反向传播与经典架构（ResNet/VGG）。',
    knowledgePoints: [
      { name: '神经网络基础', description: '感知机、MLP、激活函数（ReLU/Sigmoid/Tanh）', difficulty: '进阶' },
      { name: '反向传播', description: '链式法则、梯度下降、自动微分', difficulty: '进阶' },
      { name: 'CNN', description: '卷积运算、池化层、LeNet/AlexNet/VGG/ResNet', difficulty: '进阶' },
      { name: '优化技巧', description: 'BatchNorm、Dropout、学习率调度', difficulty: '进阶' },
    ],
    codeExample: `import numpy as np
class NeuralNetwork:
    def __init__(self, layers):
        self.weights = [np.random.randn(layers[i], layers[i+1]) * 0.01 for i in range(len(layers)-1)]
        self.biases = [np.zeros((1, layers[i+1])) for i in range(len(layers)-1)]
    def forward(self, X):
        self.a = [X]
        for W, b in zip(self.weights, self.biases):
            self.a.append(1 / (1 + np.exp(-(self.a[-1] @ W + b))))
        return self.a[-1]`,
    faq: ['什么是反向传播？为什么需要它？', 'CNN 和全连接网络的区别是什么？', '什么是梯度消失/爆炸？如何解决？'],
  },
  {
    id: 19, name: '自然语言处理', direction: 'ai', difficulty: '进阶', prerequisites: [18], themeColor: '#06d6a0',
    description: '学习分词、词向量、序列标注、Transformer架构与BERT/GPT预训练模型。',
    knowledgePoints: [
      { name: 'NLP基础', description: '分词技术、词向量（Word2Vec/GloVe/FastText）', difficulty: '进阶' },
      { name: '序列标注', description: 'POS Tagging、NER、Chunking', difficulty: '进阶' },
      { name: '注意力机制', description: 'Query-Key-Value 注意力计算', difficulty: '进阶' },
      { name: 'Transformer', description: 'Self-Attention、多头注意力、位置编码', difficulty: '高级' },
      { name: 'BERT', description: '双向编码器、MLM+NSP 预训练', difficulty: '高级' },
      { name: 'GPT', description: '自回归语言模型、Scaling Law', difficulty: '高级' },
    ],
    faq: ['Word2Vec 和 GloVe 的区别是什么？', 'Transformer 的自注意力机制原理是什么？', 'BERT 和 GPT 的核心区别是什么？'],
  },
  {
    id: 20, name: '计算机视觉', direction: 'ai', difficulty: '进阶', prerequisites: [18], themeColor: '#f59e0b',
    description: '学习图像分类、目标检测（Faster R-CNN/YOLO）、图像分割与迁移学习。',
    knowledgePoints: [
      { name: '图像分类', description: 'AlexNet、VGG、ResNet、EfficientNet', difficulty: '进阶' },
      { name: '迁移学习', description: '预训练模型微调、特征提取', difficulty: '进阶' },
      { name: '目标检测', description: 'Faster R-CNN（RPN+ROI Head）、YOLO系列', difficulty: '高级' },
      { name: '图像分割', description: '语义分割（FCN/UNet）、实例分割（Mask R-CNN）', difficulty: '高级' },
    ],
    faq: ['两阶段检测和一阶段检测的区别是什么？', '什么是迁移学习？为什么在CV中效果好？', 'ResNet 的残差连接解决了什么问题？'],
  },
  {
    id: 21, name: '强化学习 / 生成式AI', direction: 'ai', difficulty: '高级', prerequisites: [17], themeColor: '#f43f5e',
    description: '学习MDP、DQN、PPO、GAN、扩散模型与多模态生成。',
    knowledgePoints: [
      { name: '强化学习基础', description: 'MDP、贝尔曼方程、价值函数与最优策略', difficulty: '进阶' },
      { name: '深度强化学习', description: 'DQN（用神经网络近似Q函数）、PPO', difficulty: '高级' },
      { name: 'GAN', description: '生成器与判别器对抗训练', difficulty: '高级' },
      { name: '扩散模型', description: '前向加噪与反向去噪', difficulty: '高级' },
      { name: '多模态生成', description: '文本到图像（Stable Diffusion）、文本到视频', difficulty: '高级' },
    ],
    codeExample: `class SimpleDQN:
    def __init__(self, state_dim, action_dim, lr=0.001, gamma=0.99):
        self.gamma = gamma
        self.weights = np.random.randn(state_dim, action_dim) * 0.01
    def predict(self, state):
        return np.dot(state, self.weights)
    def act(self, state, epsilon=0.1):
        if np.random.random() < epsilon:
            return np.random.randint(self.weights.shape[1])
        return np.argmax(self.predict(state))`,
    faq: ['什么是马尔可夫决策过程？', 'DQN 如何解决状态空间爆炸问题？', 'GAN 的生成器和判别器是如何对抗的？'],
  },
  {
    id: 22, name: '计算机图形学', direction: 'frontier', difficulty: '高级', prerequisites: [1, 5], themeColor: '#2E7D32',
    description: '学习图形渲染流水线、光照着色、曲线曲面、纹理映射与光线追踪。',
    knowledgePoints: [
      { name: '图形系统概述', description: '图形流水线、光栅化、GPU 架构', difficulty: '入门' },
      { name: '三维变换', description: '三维变换、投影（透视/正交）、视口变换', difficulty: '进阶' },
      { name: '光照与着色', description: 'Phong 光照模型、Blinn-Phong、着色器编程', difficulty: '高级' },
      { name: '曲线与曲面', description: 'Bézier 曲线、B-样条、NURBS', difficulty: '高级' },
      { name: '纹理映射', description: 'UV 映射、Mipmap、法线贴图', difficulty: '进阶' },
      { name: '光线追踪', description: '光线求交、路径追踪、全局光照', difficulty: '高级' },
    ],
    faq: ['图形渲染流水线的主要阶段有哪些？', 'Phong 光照模型由哪几部分组成？', '光线追踪和光栅化渲染的区别是什么？'],
  },
  {
    id: 23, name: '信息安全基础', direction: 'frontier', difficulty: '进阶', prerequisites: [10], themeColor: '#C62828',
    description: '学习密码学、身份认证、Web安全（XSS/CSRF/SQL注入）与OWASP Top 10防御。',
    knowledgePoints: [
      { name: '信息安全概述', description: 'CIA 三要素、安全威胁分类、安全机制', difficulty: '入门' },
      { name: '密码学基础', description: '对称加密（AES/DES）、非对称加密（RSA/ECC）', difficulty: '进阶' },
      { name: '哈希与签名', description: 'MD5/SHA、HMAC、数字签名算法', difficulty: '进阶' },
      { name: '身份认证', description: '口令认证、多因素认证、生物特征认证', difficulty: '进阶' },
      { name: 'Web 安全', description: 'HTTPS/TLS、SQL注入、XSS、CSRF', difficulty: '高级' },
      { name: '隐私保护', description: '数据脱敏、差分隐私、同态加密', difficulty: '高级' },
    ],
    faq: ['对称加密和非对称加密的区别是什么？', '什么是 XSS 和 CSRF 攻击？如何防御？', 'HTTPS 的握手过程是怎样的？'],
  },
  {
    id: 24, name: '大数据与云计算', direction: 'frontier', difficulty: '高级', prerequisites: [11], themeColor: '#00695C',
    description: '学习Hadoop生态、Spark、流式计算、Docker/K8s与云原生技术。',
    knowledgePoints: [
      { name: '大数据概述', description: '5V 特征、Hadoop 生态体系', difficulty: '入门' },
      { name: 'HDFS', description: 'HDFS 架构、数据副本策略、读写流程', difficulty: '进阶' },
      { name: '分布式计算', description: 'MapReduce、Spark RDD/DataFrame', difficulty: '进阶' },
      { name: '流式计算', description: 'Kafka、Flink、Storm 实时流处理', difficulty: '高级' },
      { name: '云计算基础', description: 'IaaS/PaaS/SaaS、虚拟化、容器化', difficulty: '入门' },
      { name: '容器与编排', description: 'Docker、Kubernetes 核心概念与架构', difficulty: '进阶' },
      { name: '云原生', description: '微服务、服务网格（Istio）、声明式API', difficulty: '高级' },
    ],
    codeExample: `# MapReduce WordCount
def map_function(document):
    for word in document.lower().split():
        word = word.strip('.,!?;:()[]{}')
        if word: yield (word, 1)

def reduce_function(word, counts):
    return (word, sum(counts))`,
    faq: ['Hadoop 的 HDFS 和 MapReduce 分别是做什么的？', 'Spark 相比 MapReduce 有哪些优势？', 'Docker 和虚拟机有什么区别？'],
  },
]
