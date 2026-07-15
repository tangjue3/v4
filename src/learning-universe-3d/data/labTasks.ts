import type { LabTask } from '../types'

export const labTasks: LabTask[] = [
  {
    id: 'lab-c1-1',
    courseId: 1,
    title: '实现学生成绩管理系统',
    description: '使用C语言结构体和文件操作，实现一个学生成绩管理系统，支持增删改查、排序和统计功能。',
    difficulty: '入门',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '定义学生结构体',
        description: '创建包含学号、姓名、多科成绩的结构体类型，并设计数据存储方案。',
        hints: [
          '使用struct定义学生类型，包含char数组存储姓名和整型数组存储成绩',
          '考虑增加总分和平均分字段方便后续排序',
          '使用#define定义常量限制最大学生数和科目数'
        ],
        codeTemplate: '#define MAX_STUDENTS 100\n#define MAX_SUBJECTS 5\n\ntypedef struct {\n    char id[20];\n    char name[50];\n    float scores[MAX_SUBJECTS];\n    float total;\n    float average;\n} Student;',
        checkpoint: '结构体定义完整，包含所有必要字段，能通过编译'
      },
      {
        stepIndex: 1,
        title: '实现增删改查功能',
        description: '编写函数实现学生信息的添加、删除、修改和查询操作。',
        hints: [
          '使用数组存储学生数据，维护一个当前学生数量的计数器',
          '按学号查询时使用strcmp进行字符串比较',
          '删除操作可以用移动数组元素的方式实现'
        ],
        codeTemplate: 'int addStudent(Student students[], int *count, Student s) {\n    // TODO: 实现添加学生\n}\n\nint deleteStudent(Student students[], int *count, char *id) {\n    // TODO: 实现删除学生\n}\n\nStudent* queryStudent(Student students[], int count, char *id) {\n    // TODO: 实现查询学生\n}',
        checkpoint: '增删改查四个函数均可正确执行，边界情况处理合理'
      },
      {
        stepIndex: 2,
        title: '实现排序与统计',
        description: '按总分或平均分对学生进行排序，并实现成绩统计功能。',
        hints: [
          '可以使用qsort函数配合自定义比较函数实现排序',
          '统计功能包括最高分、最低分、各分数段人数等',
          '排序前先计算每个学生的总分和平均分'
        ],
        codeTemplate: 'int compareByTotal(const void *a, const void *b) {\n    // TODO: 实现比较函数\n}\n\nvoid sortStudents(Student students[], int count) {\n    // TODO: 调用qsort排序\n}\n\nvoid printStatistics(Student students[], int count) {\n    // TODO: 输出统计信息\n}',
        checkpoint: '排序结果正确，统计信息输出完整'
      },
      {
        stepIndex: 3,
        title: '实现文件读写',
        description: '将学生数据保存到文件，并支持从文件加载数据。',
        hints: [
          '使用fopen以二进制模式或文本模式打开文件',
          'fwrite/fread适合二进制模式，fprintf/fscanf适合文本模式',
          '注意检查文件是否成功打开，处理打开失败的情况'
        ],
        codeTemplate: 'int saveToFile(Student students[], int count, const char *filename) {\n    // TODO: 实现保存到文件\n}\n\nint loadFromFile(Student students[], int *count, const char *filename) {\n    // TODO: 实现从文件加载\n}',
        checkpoint: '数据能正确保存和加载，文件格式合理'
      }
    ]
  },
  {
    id: 'lab-c1-2',
    courseId: 1,
    title: '链表操作实验',
    description: '使用C语言指针和动态内存分配，实现单链表的各种操作，包括创建、插入、删除、反转等。',
    difficulty: '进阶',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '定义链表节点与创建链表',
        description: '定义链表节点结构体，实现链表的创建和基本输出功能。',
        hints: [
          '节点包含数据域和指向下一节点的指针域',
          '使用malloc动态分配节点内存',
          '维护头指针作为链表的入口'
        ],
        codeTemplate: 'typedef struct Node {\n    int data;\n    struct Node *next;\n} Node;\n\nNode* createNode(int data) {\n    // TODO: 分配内存并初始化节点\n}\n\nNode* createList(int arr[], int n) {\n    // TODO: 根据数组创建链表\n}',
        checkpoint: '能正确创建链表并输出所有节点数据'
      },
      {
        stepIndex: 1,
        title: '实现插入与删除',
        description: '实现链表在指定位置的插入和删除操作。',
        hints: [
          '插入操作需要修改前驱节点的next指针',
          '头插法需要特殊处理头指针的更新',
          '删除操作记得释放被删除节点的内存'
        ],
        codeTemplate: 'Node* insertAt(Node *head, int pos, int data) {\n    // TODO: 在pos位置插入新节点\n}\n\nNode* deleteAt(Node *head, int pos) {\n    // TODO: 删除pos位置的节点\n}',
        checkpoint: '插入和删除操作正确，内存无泄漏'
      },
      {
        stepIndex: 2,
        title: '实现链表反转',
        description: '使用迭代或递归方式反转链表。',
        hints: [
          '迭代法使用三个指针：prev、curr、next依次推进',
          '递归法需要理解递归返回的是反转后的头节点',
          '注意处理空链表和单节点链表的边界情况'
        ],
        codeTemplate: 'Node* reverseList(Node *head) {\n    // TODO: 反转链表\n}',
        checkpoint: '链表反转正确，所有节点关系正确更新'
      }
    ]
  },
  {
    id: 'lab-c2-1',
    courseId: 2,
    title: '爬虫与数据分析',
    description: '使用Python的requests和BeautifulSoup库爬取网页数据，并用pandas进行数据清洗和分析。',
    difficulty: '进阶',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '发送HTTP请求获取网页',
        description: '使用requests库发送GET请求，获取目标网页的HTML内容。',
        hints: [
          '添加User-Agent请求头模拟浏览器访问',
          '使用response.encoding或response.apparent_encoding处理编码问题',
          '检查响应状态码是否为200'
        ],
        codeTemplate: 'import requests\nfrom bs4 import BeautifulSoup\n\ndef fetch_page(url):\n    headers = {"User-Agent": "Mozilla/5.0"}\n    # TODO: 发送请求并返回HTML内容\n    pass',
        checkpoint: '能成功获取网页HTML内容，状态码为200'
      },
      {
        stepIndex: 1,
        title: '解析网页提取数据',
        description: '使用BeautifulSoup解析HTML，提取目标数据并存入列表。',
        hints: [
          '使用find或find_all方法定位元素',
          '可以通过class_、id等属性精确定位',
          '提取文本使用.get_text()方法，注意strip()去除空白'
        ],
        codeTemplate: 'def parse_data(html):\n    soup = BeautifulSoup(html, "html.parser")\n    # TODO: 提取目标数据\n    results = []\n    return results',
        checkpoint: '能正确提取所需数据字段，数据完整无缺失'
      },
      {
        stepIndex: 2,
        title: '数据清洗与分析',
        description: '使用pandas对爬取的数据进行清洗、转换和基本统计分析。',
        hints: [
          '使用pd.DataFrame创建数据框',
          'dropna()去除缺失值，fillna()填充缺失值',
          '使用describe()查看基本统计信息'
        ],
        codeTemplate: 'import pandas as pd\n\ndef analyze_data(data_list):\n    df = pd.DataFrame(data_list)\n    # TODO: 数据清洗\n    # TODO: 统计分析\n    return df',
        checkpoint: '数据清洗完整，统计分析结果合理'
      },
      {
        stepIndex: 3,
        title: '数据可视化',
        description: '使用matplotlib将分析结果以图表形式展示。',
        hints: [
          '使用plt.figure()设置图表大小',
          '中文显示需要设置字体：plt.rcParams["font.sans-serif"]',
          '使用plt.savefig()保存图表到文件'
        ],
        codeTemplate: 'import matplotlib.pyplot as plt\n\ndef visualize(df):\n    plt.rcParams["font.sans-serif"] = ["SimHei"]\n    # TODO: 绘制图表\n    plt.show()',
        checkpoint: '图表清晰展示分析结果，标签和标题完整'
      }
    ]
  },
  {
    id: 'lab-c2-2',
    courseId: 2,
    title: '装饰器与上下文管理器',
    description: '深入理解Python高级特性，实现自定义装饰器和上下文管理器。',
    difficulty: '高级',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '实现基础装饰器',
        description: '创建一个计时装饰器，能自动测量函数执行时间。',
        hints: [
          '使用functools.wraps保留原函数的元信息',
          '在wrapper函数中记录开始和结束时间',
          '使用time.perf_counter()获取高精度时间'
        ],
        codeTemplate: 'import time\nfrom functools import wraps\n\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        # TODO: 计时并执行函数\n        pass\n    return wrapper',
        checkpoint: '装饰器能正确计时并返回原函数结果'
      },
      {
        stepIndex: 1,
        title: '实现带参数的装饰器',
        description: '创建可配置的重试装饰器，支持设置重试次数和延迟。',
        hints: [
          '带参数装饰器是三层嵌套函数结构',
          '外层函数接收装饰器参数，返回真正的装饰器',
          '使用try-except捕获异常并决定是否重试'
        ],
        codeTemplate: 'def retry(max_attempts=3, delay=1):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            # TODO: 实现重试逻辑\n            pass\n        return wrapper\n    return decorator',
        checkpoint: '装饰器能按参数重试，最终成功或抛出异常'
      },
      {
        stepIndex: 2,
        title: '实现上下文管理器',
        description: '使用类和contextlib两种方式实现数据库连接的上下文管理器。',
        hints: [
          '类方式需要实现__enter__和__exit__方法',
          '__exit__方法的参数可以处理异常：exc_type, exc_val, exc_tb',
          'contextlib方式使用@contextmanager装饰器和yield'
        ],
        codeTemplate: 'from contextlib import contextmanager\n\nclass DBConnection:\n    def __enter__(self):\n        # TODO: 建立连接\n        pass\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        # TODO: 关闭连接\n        pass\n\n@contextmanager\ndef db_connection():\n    # TODO: 使用contextlib实现\n    yield',
        checkpoint: '两种方式均能正确管理资源，异常时也能正确清理'
      }
    ]
  },
  {
    id: 'lab-c3-1',
    courseId: 3,
    title: '集合框架应用',
    description: '综合运用Java集合框架中的List、Set、Map等，实现一个图书管理系统。',
    difficulty: '入门',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '定义图书类与数据结构',
        description: '创建Book类，并选择合适的集合类型存储图书数据。',
        hints: [
          'Book类需要实现equals和hashCode方法以便在Set和Map中使用',
          '使用ArrayList存储有序图书列表，HashMap实现ISBN快速查找',
          '考虑使用LinkedHashMap保持插入顺序同时支持快速查找'
        ],
        codeTemplate: 'public class Book {\n    private String isbn;\n    private String title;\n    private String author;\n    // TODO: 构造方法、getter、equals、hashCode\n}',
        checkpoint: 'Book类定义完整，equals和hashCode正确实现'
      },
      {
        stepIndex: 1,
        title: '实现增删改查操作',
        description: '使用不同集合类型实现图书的增删改查功能。',
        hints: [
          '使用Map的put、remove、get方法操作数据',
          '遍历可使用增强for循环或迭代器',
          '查询结果可用Stream API进行过滤和排序'
        ],
        codeTemplate: 'public class Library {\n    private Map<String, Book> books = new HashMap<>();\n\n    public void addBook(Book book) { /* TODO */ }\n    public void removeBook(String isbn) { /* TODO */ }\n    public Book findByIsbn(String isbn) { /* TODO */ }\n    public List<Book> findByAuthor(String author) { /* TODO */ }\n}',
        checkpoint: '所有操作正确执行，Stream查询结果准确'
      },
      {
        stepIndex: 2,
        title: '实现排序与统计',
        description: '使用Comparator和Stream实现多条件排序和统计功能。',
        hints: [
          'Comparator.comparing().thenComparing()实现多条件排序',
          'Stream的collect(Collectors.groupingBy())实现分组统计',
          '使用Collectors.counting()统计每组数量'
        ],
        codeTemplate: 'public List<Book> sortBooks(Comparator<Book> comp) {\n    // TODO: 排序\n    return null;\n}\n\npublic Map<String, Long> countByAuthor() {\n    // TODO: 按作者分组统计\n    return null;\n}',
        checkpoint: '排序结果正确，分组统计准确'
      }
    ]
  },
  {
    id: 'lab-c3-2',
    courseId: 3,
    title: '多线程生产者消费者',
    description: '使用Java多线程机制实现经典的生产者消费者模型，掌握线程同步与通信。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '设计共享缓冲区',
        description: '实现一个线程安全的有限缓冲区，支持阻塞式的存取操作。',
        hints: [
          '使用synchronized关键字或ReentrantLock保护共享数据',
          '使用wait/notify或Condition实现阻塞等待',
          '缓冲区满时生产者等待，缓冲区空时消费者等待'
        ],
        codeTemplate: 'public class Buffer<T> {\n    private Queue<T> queue = new LinkedList<>();\n    private int capacity;\n\n    public synchronized void put(T item) throws InterruptedException {\n        // TODO: 缓冲区满则等待，否则放入\n    }\n\n    public synchronized T take() throws InterruptedException {\n        // TODO: 缓冲区空则等待，否则取出\n        return null;\n    }\n}',
        checkpoint: '缓冲区操作线程安全，不会出现数据丢失或死锁'
      },
      {
        stepIndex: 1,
        title: '实现生产者和消费者线程',
        description: '创建生产者和消费者线程类，向缓冲区存取数据。',
        hints: [
          '实现Runnable接口或继承Thread类',
          '生产者在循环中生成数据并调用put方法',
          '消费者在循环中调用take方法并处理数据'
        ],
        codeTemplate: 'public class Producer implements Runnable {\n    private Buffer<Integer> buffer;\n    public Producer(Buffer<Integer> buffer) { this.buffer = buffer; }\n    public void run() {\n        // TODO: 循环生产数据\n    }\n}\n\npublic class Consumer implements Runnable {\n    private Buffer<Integer> buffer;\n    public Consumer(Buffer<Integer> buffer) { this.buffer = buffer; }\n    public void run() {\n        // TODO: 循环消费数据\n    }\n}',
        checkpoint: '生产者和消费者能正确协作，数据不丢失不重复'
      },
      {
        stepIndex: 2,
        title: '使用BlockingQueue优化',
        description: '使用Java内置的BlockingQueue替换自定义缓冲区，简化代码。',
        hints: [
          'ArrayBlockingQueue是有界阻塞队列，自动处理线程同步',
          'put和take方法已内置阻塞逻辑',
          '对比自定义实现和BlockingQueue的代码复杂度'
        ],
        codeTemplate: 'import java.util.concurrent.BlockingQueue;\nimport java.util.concurrent.ArrayBlockingQueue;\n\nBlockingQueue<Integer> queue = new ArrayBlockingQueue<>(10);\n// TODO: 使用BlockingQueue重写生产者消费者',
        checkpoint: '使用BlockingQueue实现功能等价，代码更简洁'
      }
    ]
  },
  {
    id: 'lab-c4-1',
    courseId: 4,
    title: 'STL容器应用',
    description: '综合运用C++ STL中的vector、map、set等容器，实现一个词频统计与文本分析工具。',
    difficulty: '入门',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '读取文本并分词',
        description: '从文件读取文本内容，按空格和标点分割为单词列表。',
        hints: [
          '使用std::ifstream读取文件内容',
          '使用std::stringstream或正则表达式分割字符串',
          '将单词统一转为小写以避免大小写差异'
        ],
        codeTemplate: '#include <fstream>\n#include <sstream>\n#include <vector>\n#include <string>\n\nstd::vector<std::string> tokenize(const std::string& text) {\n    // TODO: 分词并返回单词列表\n}',
        checkpoint: '能正确分割文本，处理标点和大小写'
      },
      {
        stepIndex: 1,
        title: '统计词频',
        description: '使用map统计每个单词的出现次数。',
        hints: [
          'std::map<std::string, int>自动按键排序',
          '使用word_count[word]++即可统计',
          '如需按频率排序，将数据转入vector再排序'
        ],
        codeTemplate: '#include <map>\n\nstd::map<std::string, int> countWords(const std::vector<std::string>& words) {\n    // TODO: 统计词频\n}',
        checkpoint: '词频统计正确，结果按字典序排列'
      },
      {
        stepIndex: 2,
        title: '排序与输出高频词',
        description: '按词频降序排列，输出前N个高频词。',
        hints: [
          '将map内容复制到vector<pair<string,int>>中',
          '使用sort配合自定义比较函数按频率降序排序',
          '使用std::set存储停用词，过滤常见无意义词'
        ],
        codeTemplate: '#include <algorithm>\n#include <set>\n\nvoid printTopN(const std::map<std::string, int>& wordCount, int n) {\n    // TODO: 排序并输出前N个高频词\n}',
        checkpoint: '输出结果按频率降序，停用词已过滤'
      }
    ]
  },
  {
    id: 'lab-c4-2',
    courseId: 4,
    title: '智能指针与RAII',
    description: '学习C++智能指针的使用，理解RAII资源管理原则，实现自动内存管理。',
    difficulty: '进阶',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '实现RAII资源管理类',
        description: '创建一个文件句柄管理类，利用RAII自动关闭文件。',
        hints: [
          '构造函数中获取资源，析构函数中释放资源',
          '禁用拷贝构造和拷贝赋值，或实现深拷贝',
          '考虑使用std::unique_ptr管理动态分配的资源'
        ],
        codeTemplate: 'class FileHandle {\n    FILE* file_;\npublic:\n    FileHandle(const char* filename, const char* mode);\n    ~FileHandle();\n    FileHandle(const FileHandle&) = delete;\n    FileHandle& operator=(const FileHandle&) = delete;\n    // TODO: 实现构造和析构\n};',
        checkpoint: '文件在对象生命周期结束时自动关闭，无资源泄漏'
      },
      {
        stepIndex: 1,
        title: '使用unique_ptr管理独占资源',
        description: '使用std::unique_ptr管理动态分配的对象，实现所有权转移。',
        hints: [
          'std::make_unique是C++14创建unique_ptr的推荐方式',
          '使用std::move转移unique_ptr的所有权',
          'unique_ptr离开作用域时自动删除所管理对象'
        ],
        codeTemplate: '#include <memory>\n\nclass Resource {\npublic:\n    Resource() { /* 初始化 */ }\n    ~Resource() { /* 清理 */ }\n    void doWork() { /* 操作 */ }\n};\n\nvoid useUniquePtr() {\n    // TODO: 使用unique_ptr管理Resource\n}',
        checkpoint: 'unique_ptr正确管理对象生命周期，所有权转移正确'
      },
      {
        stepIndex: 2,
        title: '使用shared_ptr共享资源',
        description: '使用std::shared_ptr实现共享所有权的资源管理。',
        hints: [
          'shared_ptr使用引用计数管理共享资源',
          'use_count()方法可查看当前引用计数',
          '注意循环引用问题，使用weak_ptr打破循环'
        ],
        codeTemplate: '#include <memory>\n\nstruct Node {\n    std::shared_ptr<Node> next;\n    std::weak_ptr<Node> prev;\n    int data;\n};\n\nvoid testSharedPtr() {\n    // TODO: 创建链表节点，测试shared_ptr和weak_ptr\n}',
        checkpoint: 'shared_ptr引用计数正确，weak_ptr避免循环引用'
      }
    ]
  },
  {
    id: 'lab-c5-1',
    courseId: 5,
    title: '二叉树遍历实现',
    description: '实现二叉树的前序、中序、后序和层序遍历，理解递归与非递归的实现方式。',
    difficulty: '入门',
    estimatedMinutes: 30,
    steps: [
      {
        stepIndex: 0,
        title: '定义二叉树节点与创建',
        description: '定义二叉树节点结构，实现二叉树的创建功能。',
        hints: [
          '节点包含数据域和左右子树指针',
          '可按前序序列创建二叉树，空节点用特殊标记表示',
          '也可通过层序遍历的数组形式创建'
        ],
        codeTemplate: 'typedef struct TreeNode {\n    int val;\n    struct TreeNode *left;\n    struct TreeNode *right;\n} TreeNode;\n\nTreeNode* createNode(int val) {\n    // TODO: 创建节点\n}',
        checkpoint: '能正确创建指定结构的二叉树'
      },
      {
        stepIndex: 1,
        title: '实现递归遍历',
        description: '实现前序、中序、后序的递归遍历算法。',
        hints: [
          '前序：根→左→右，中序：左→根→右，后序：左→右→根',
          '递归终止条件是节点为空',
          '注意三种遍历的访问顺序差异'
        ],
        codeTemplate: 'void preorder(TreeNode *root) {\n    // TODO: 前序遍历\n}\n\nvoid inorder(TreeNode *root) {\n    // TODO: 中序遍历\n}\n\nvoid postorder(TreeNode *root) {\n    // TODO: 后序遍历\n}',
        checkpoint: '三种递归遍历输出结果正确'
      },
      {
        stepIndex: 2,
        title: '实现非递归遍历',
        description: '使用栈实现前序和中序的非递归遍历，使用队列实现层序遍历。',
        hints: [
          '前序非递归：先访问根节点，右子树入栈，再处理左子树',
          '中序非递归：沿左子树一路入栈，弹出时访问并转向右子树',
          '层序遍历使用队列，每次弹出队首并将其子节点入队'
        ],
        codeTemplate: 'void preorderIterative(TreeNode *root) {\n    // TODO: 使用栈实现前序遍历\n}\n\nvoid levelOrder(TreeNode *root) {\n    // TODO: 使用队列实现层序遍历\n}',
        checkpoint: '非递归遍历结果与递归遍历一致'
      }
    ]
  },
  {
    id: 'lab-c5-2',
    courseId: 5,
    title: '图的最短路径',
    description: '实现Dijkstra算法和Floyd算法，求解加权图中的最短路径问题。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '图的邻接矩阵表示',
        description: '使用邻接矩阵存储加权有向图，实现图的创建和输出。',
        hints: [
          '不可达的边用INF（如INT_MAX/2）表示',
          '对角线元素距离为0',
          '使用二维数组或vector<vector<int>>存储'
        ],
        codeTemplate: '#define INF 99999\n#define MAX_V 100\n\nint graph[MAX_V][MAX_V];\nint vertexCount;\n\nvoid initGraph(int v) {\n    // TODO: 初始化图\n}',
        checkpoint: '图能正确表示，邻接矩阵输出无误'
      },
      {
        stepIndex: 1,
        title: '实现Dijkstra算法',
        description: '实现单源最短路径的Dijkstra算法。',
        hints: [
          '维护一个visited数组标记已确定最短路径的顶点',
          '每次选择未访问顶点中距离最小的进行松弛',
          '时间复杂度O(V²)，可使用优先队列优化至O(E log V)'
        ],
        codeTemplate: 'void dijkstra(int graph[MAX_V][MAX_V], int src, int dist[]) {\n    int visited[MAX_V] = {0};\n    // TODO: 实现Dijkstra算法\n}',
        checkpoint: '单源最短路径计算结果正确'
      },
      {
        stepIndex: 2,
        title: '实现Floyd算法',
        description: '实现全源最短路径的Floyd-Warshall算法。',
        hints: [
          '三重循环：外层枚举中转点k，内两层枚举顶点对(i,j)',
          '状态转移：dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])',
          '注意循环顺序必须是k在外层'
        ],
        codeTemplate: 'void floyd(int dist[MAX_V][MAX_V], int n) {\n    // TODO: 实现Floyd算法\n}',
        checkpoint: '所有顶点对的最短路径计算正确'
      }
    ]
  },
  {
    id: 'lab-c6-1',
    courseId: 6,
    title: '动态规划实战',
    description: '通过经典动态规划问题（背包、最长公共子序列）掌握DP解题方法论。',
    difficulty: '进阶',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '0-1背包问题',
        description: '实现0-1背包问题的动态规划解法。',
        hints: [
          '定义dp[i][w]表示前i个物品、容量为w时的最大价值',
          '状态转移：dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi]+vi)',
          '可优化为一维数组，注意逆序遍历'
        ],
        codeTemplate: 'def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    # TODO: 填充dp表\n    return dp[n][capacity]',
        checkpoint: '背包问题求解正确，能输出最优解'
      },
      {
        stepIndex: 1,
        title: '最长公共子序列',
        description: '实现LCS的动态规划解法，并输出具体子序列。',
        hints: [
          'dp[i][j]表示s1前i个字符与s2前j个字符的LCS长度',
          '若s1[i-1]==s2[j-2]，dp[i][j]=dp[i-1][j-1]+1',
          '回溯dp表可还原具体子序列'
        ],
        codeTemplate: 'def lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    # TODO: 填充dp表\n    # TODO: 回溯得到LCS\n    return lcs_str',
        checkpoint: 'LCS长度和具体序列均正确'
      },
      {
        stepIndex: 2,
        title: '空间优化与扩展',
        description: '将DP空间复杂度优化，并尝试解决完全背包问题。',
        hints: [
          '0-1背包一维优化：内层循环逆序遍历',
          '完全背包一维优化：内层循环正序遍历',
          '完全背包每个物品可以使用无限次'
        ],
        codeTemplate: 'def knapsack_1d(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    # TODO: 一维DP优化\n    return dp[capacity]\n\ndef complete_knapsack(weights, values, capacity):\n    dp = [0] * (capacity + 1)\n    # TODO: 完全背包\n    return dp[capacity]',
        checkpoint: '优化后结果与二维DP一致，完全背包结果正确'
      }
    ]
  },
  {
    id: 'lab-c6-2',
    courseId: 6,
    title: '回溯法解决数独',
    description: '使用回溯算法实现数独求解器，掌握约束满足问题的通用解法。',
    difficulty: '高级',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '表示数独棋盘',
        description: '使用二维数组表示数独，0表示空格。',
        hints: [
          '使用9x9的二维int数组表示棋盘',
          '0表示待填位置，1-9表示已填数字',
          '可以从字符串或文件读取初始棋盘'
        ],
        codeTemplate: 'board = [\n    [5,3,0,0,7,0,0,0,0],\n    [6,0,0,1,9,5,0,0,0],\n    [0,9,8,0,0,0,0,6,0],\n    # ... 其余行\n]',
        checkpoint: '棋盘数据结构正确，能正确读取和显示'
      },
      {
        stepIndex: 1,
        title: '实现合法性检查',
        description: '检查在指定位置填入数字是否满足数独规则。',
        hints: [
          '检查同行是否有重复数字',
          '检查同列是否有重复数字',
          '检查3x3宫格内是否有重复数字'
        ],
        codeTemplate: 'def is_valid(board, row, col, num):\n    # TODO: 检查行\n    # TODO: 检查列\n    # TODO: 检查3x3宫格\n    return True',
        checkpoint: '合法性检查覆盖行、列、宫格三种约束'
      },
      {
        stepIndex: 2,
        title: '实现回溯求解',
        description: '使用递归回溯法填充所有空格，找到数独的解。',
        hints: [
          '找到第一个空格，尝试填入1-9',
          '若合法则递归求解下一个空格',
          '递归返回False则回溯，尝试下一个数字'
        ],
        codeTemplate: 'def solve(board):\n    # TODO: 找到空格位置\n    # TODO: 尝试1-9并递归\n    return False',
        checkpoint: '能正确求解标准数独，结果满足所有约束'
      }
    ]
  },
  {
    id: 'lab-c7-1',
    courseId: 7,
    title: '词法分析器实现',
    description: '实现一个简单的词法分析器，能将源代码字符串分解为Token序列。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '定义Token类型',
        description: '设计Token的数据结构，定义各类词法单元类型。',
        hints: [
          'Token包含类型、值和位置信息（行号、列号）',
          '常见类型：关键字、标识符、数字、运算符、分隔符',
          '使用枚举类型定义Token类别'
        ],
        codeTemplate: 'from enum import Enum, auto\n\nclass TokenType(Enum):\n    KEYWORD = auto()\n    IDENTIFIER = auto()\n    NUMBER = auto()\n    OPERATOR = auto()\n    DELIMITER = auto()\n    EOF = auto()\n\nclass Token:\n    def __init__(self, type, value, line, col):\n        # TODO: 初始化Token\n        pass',
        checkpoint: 'Token类型定义完整，能表示所有词法单元'
      },
      {
        stepIndex: 1,
        title: '实现扫描与分词',
        description: '逐字符扫描源代码，识别并生成Token序列。',
        hints: [
          '跳过空白字符和注释',
          '标识符和关键字共享前缀，先识别为标识符再查关键字表',
          '数字需要处理整数和浮点数两种情况'
        ],
        codeTemplate: 'class Lexer:\n    def __init__(self, source):\n        self.source = source\n        self.pos = 0\n        self.line = 1\n        self.col = 1\n\n    def next_token(self):\n        # TODO: 读取并返回下一个Token\n        pass',
        checkpoint: '能正确识别各类Token，位置信息准确'
      },
      {
        stepIndex: 2,
        title: '错误处理与测试',
        description: '添加词法错误检测和报告功能，编写测试用例。',
        hints: [
          '遇到非法字符时记录错误位置并跳过',
          '未闭合的注释或字符串应报错',
          '测试用例应覆盖所有Token类型和错误情况'
        ],
        codeTemplate: 'class LexicalError(Exception):\n    def __init__(self, message, line, col):\n        # TODO: 初始化错误信息\n        pass',
        checkpoint: '能检测并报告词法错误，测试用例全部通过'
      }
    ]
  },
  {
    id: 'lab-c7-2',
    courseId: 7,
    title: '递归下降解析器',
    description: '实现一个递归下降的语法分析器，解析简单的算术表达式。',
    difficulty: '高级',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '定义文法规则',
        description: '为算术表达式编写上下文无关文法，消除左递归。',
        hints: [
          '基本文法：E→E+T|T 需要消除左递归',
          '消除后：E→TE\', E\'→+TE\'|ε',
          '考虑加入乘除和括号：T→FT\', T\'→*FT\'|ε, F→(E)|num'
        ],
        codeTemplate: '# 文法定义：\n# E  -> T E\'\n# E\' -> + T E\' | - T E\' | ε\n# T  -> F T\'\n# T\' -> * F T\' | / F T\' | ε\n# F  -> ( E ) | NUMBER',
        checkpoint: '文法无左递归，能正确描述算术表达式'
      },
      {
        stepIndex: 1,
        title: '实现解析函数',
        description: '为每个非终结符编写递归解析函数。',
        hints: [
          '每个非终结符对应一个解析函数',
          '函数根据当前Token决定使用哪条产生式',
          '解析成功返回AST节点，失败抛出语法错误'
        ],
        codeTemplate: 'class Parser:\n    def __init__(self, tokens):\n        self.tokens = tokens\n        self.pos = 0\n\n    def parse_E(self):\n        # TODO: E -> T E\'\n        pass\n\n    def parse_E_prime(self):\n        # TODO: E\' -> + T E\' | ε\n        pass',
        checkpoint: '解析函数能正确处理加减乘除和括号'
      },
      {
        stepIndex: 2,
        title: '构建AST并求值',
        description: '在解析过程中构建抽象语法树，并实现表达式求值。',
        hints: [
          'AST节点包含操作符和操作数子节点',
          '叶子节点存储数字值',
          '递归遍历AST进行求值'
        ],
        codeTemplate: 'class ASTNode:\n    def __init__(self, type, value=None, left=None, right=None):\n        # TODO: 初始化AST节点\n        pass\n\ndef evaluate(node):\n    # TODO: 递归求值\n    pass',
        checkpoint: 'AST构建正确，求值结果与直接计算一致'
      }
    ]
  },
  {
    id: 'lab-c8-1',
    courseId: 8,
    title: 'ALU模拟器',
    description: '模拟实现计算机算术逻辑单元，支持基本算术和逻辑运算。',
    difficulty: '入门',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '实现补码表示',
        description: '实现8位补码整数的表示与转换。',
        hints: [
          '正数的补码就是其二进制表示',
          '负数的补码是其绝对值取反加一',
          '最高位为符号位，0正1负'
        ],
        codeTemplate: 'def to_twos_complement(num, bits=8):\n    # TODO: 将整数转为补码二进制字符串\n    pass\n\ndef from_twos_complement(binary, bits=8):\n    # TODO: 将补码二进制转为整数\n    pass',
        checkpoint: '补码转换正确，正负数均能正确处理'
      },
      {
        stepIndex: 1,
        title: '实现算术运算',
        description: '实现补码加法、减法，并检测溢出。',
        hints: [
          '减法通过加上减数的补码实现',
          '溢出判断：正+正得负，或负+负得正',
          '使用位运算模拟硬件加法器'
        ],
        codeTemplate: 'def add(a, b, bits=8):\n    # TODO: 补码加法，返回结果和溢出标志\n    pass\n\ndef subtract(a, b, bits=8):\n    # TODO: 补码减法\n    pass',
        checkpoint: '加减法结果正确，溢出检测准确'
      },
      {
        stepIndex: 2,
        title: '实现逻辑运算',
        description: '实现AND、OR、NOT、XOR等位逻辑运算。',
        hints: [
          '使用Python的&、|、~、^运算符',
          'NOT运算需要注意补码表示下的取反',
          '结果需要截断到指定位数'
        ],
        codeTemplate: 'def logical_and(a, b, bits=8):\n    # TODO: 按位与\n    pass\n\ndef logical_or(a, b, bits=8):\n    # TODO: 按位或\n    pass\n\ndef logical_xor(a, b, bits=8):\n    # TODO: 按位异或\n    pass',
        checkpoint: '逻辑运算结果正确，位数截断无误'
      }
    ]
  },
  {
    id: 'lab-c8-2',
    courseId: 8,
    title: 'Cache模拟',
    description: '模拟CPU Cache的工作原理，实现直接映射和组相联Cache。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '实现直接映射Cache',
        description: '实现直接映射方式的Cache，模拟地址映射和命中判断。',
        hints: [
          '地址分为标记(Tag)、行号(Index)和块内偏移(Offset)',
          '每个Cache行包含有效位、标记和数据',
          '映射方式：Index = 地址 % Cache行数'
        ],
        codeTemplate: 'class DirectMappedCache:\n    def __init__(self, size, block_size):\n        # TODO: 初始化Cache结构\n        pass\n\n    def access(self, address):\n        # TODO: 模拟访问，返回命中/缺失\n        pass',
        checkpoint: 'Cache命中和缺失判断正确'
      },
      {
        stepIndex: 1,
        title: '实现组相联Cache',
        description: '实现N路组相联Cache，支持LRU替换策略。',
        hints: [
          '每组包含N个Cache行，同组内可放置多个块',
          'LRU需要记录每组中各行的访问顺序',
          '可用计数器或双向链表实现LRU'
        ],
        codeTemplate: 'class SetAssociativeCache:\n    def __init__(self, size, block_size, ways):\n        # TODO: 初始化N路组相联Cache\n        pass\n\n    def access(self, address):\n        # TODO: 模拟访问，LRU替换\n        pass',
        checkpoint: '组相联映射正确，LRU替换策略工作正常'
      },
      {
        stepIndex: 2,
        title: '性能对比分析',
        description: '使用相同的访存序列测试不同Cache配置的命中率。',
        hints: [
          '生成具有局部性的访存序列（如循环访问）',
          '对比不同容量、不同相联度的命中率',
          '分析Cache大小和相联度对命中率的影响'
        ],
        codeTemplate: 'def generate_access_sequence(pattern, length):\n    # TODO: 生成测试访存序列\n    pass\n\ndef compare_caches(sequence, configs):\n    # TODO: 对比不同配置的命中率\n    pass',
        checkpoint: '性能对比数据合理，分析结论正确'
      }
    ]
  },
  {
    id: 'lab-c9-1',
    courseId: 9,
    title: '进程调度模拟',
    description: '模拟操作系统的进程调度算法，包括FCFS、SJF、RR等。',
    difficulty: '入门',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '定义进程控制块',
        description: '设计PCB数据结构，包含进程状态、优先级、时间信息等。',
        hints: [
          'PCB包含进程ID、到达时间、服务时间、剩余时间',
          '还需记录开始时间、完成时间用于计算周转时间',
          '进程状态：就绪、运行、完成'
        ],
        codeTemplate: 'class PCB:\n    def __init__(self, pid, arrival, burst):\n        self.pid = pid\n        self.arrival = arrival\n        self.burst = burst\n        self.remaining = burst\n        self.start = None\n        self.finish = None\n        self.state = "ready"',
        checkpoint: 'PCB结构完整，字段含义清晰'
      },
      {
        stepIndex: 1,
        title: '实现FCFS和SJF调度',
        description: '实现先来先服务和短作业优先调度算法。',
        hints: [
          'FCFS按到达时间排序，依次执行',
          'SJF在就绪队列中选择服务时间最短的进程',
          'SJF分为抢占式(最短剩余时间优先)和非抢占式'
        ],
        codeTemplate: 'def fcfs(processes):\n    # TODO: 先来先服务调度\n    pass\n\ndef sjf(processes):\n    # TODO: 短作业优先调度\n    pass',
        checkpoint: '调度顺序正确，周转时间和带权周转时间计算准确'
      },
      {
        stepIndex: 2,
        title: '实现时间片轮转调度',
        description: '实现RR调度算法，分析时间片大小对性能的影响。',
        hints: [
          '使用队列管理就绪进程',
          '每个进程执行一个时间片后若未完成则排到队尾',
          '时间片过大退化为FCFS，过小则切换开销大'
        ],
        codeTemplate: 'def round_robin(processes, quantum):\n    # TODO: 时间片轮转调度\n    pass',
        checkpoint: 'RR调度正确，不同时间片的性能差异分析合理'
      }
    ]
  },
  {
    id: 'lab-c9-2',
    courseId: 9,
    title: '内存页面置换模拟',
    description: '模拟虚拟内存的页面置换算法，对比FIFO、LRU、OPT的缺页率。',
    difficulty: '进阶',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '实现FIFO页面置换',
        description: '实现先进先出页面置换算法。',
        hints: [
          '使用队列记录页面进入内存的顺序',
          '缺页时淘汰最早进入的页面',
          '注意Belady异常：帧数增加缺页率可能反而上升'
        ],
        codeTemplate: 'def fifo(pages, frame_count):\n    frames = []\n    page_faults = 0\n    # TODO: 实现FIFO置换\n    return page_faults',
        checkpoint: 'FIFO缺页次数计算正确'
      },
      {
        stepIndex: 1,
        title: '实现LRU页面置换',
        description: '实现最近最久未使用页面置换算法。',
        hints: [
          '每次访问更新页面的使用时间戳',
          '缺页时淘汰时间戳最早的页面',
          '也可用栈或计数器实现'
        ],
        codeTemplate: 'def lru(pages, frame_count):\n    frames = {}\n    page_faults = 0\n    # TODO: 实现LRU置换\n    return page_faults',
        checkpoint: 'LRU缺页次数计算正确'
      },
      {
        stepIndex: 2,
        title: '实现OPT与对比分析',
        description: '实现最佳置换算法，对比三种算法的缺页率。',
        hints: [
          'OPT淘汰未来最长时间不被使用的页面',
          '需要预知未来的页面访问序列',
          'OPT是理论最优，作为其他算法的性能上界'
        ],
        codeTemplate: 'def opt(pages, frame_count):\n    frames = []\n    page_faults = 0\n    # TODO: 实现OPT置换\n    return page_faults\n\ndef compare_algorithms(pages, frame_counts):\n    # TODO: 对比不同帧数下各算法缺页率\n    pass',
        checkpoint: 'OPT结果正确，三种算法对比分析完整'
      }
    ]
  },
  {
    id: 'lab-c10-1',
    courseId: 10,
    title: 'TCP聊天室',
    description: '使用Socket编程实现一个多用户的TCP聊天室，支持群聊和私聊功能。',
    difficulty: '进阶',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '实现TCP服务器',
        description: '创建TCP服务器，监听端口并接受多个客户端连接。',
        hints: [
          '使用socket.socket()创建TCP套接字',
          'bind绑定地址和端口，listen开始监听',
          '使用select或threading处理多客户端并发'
        ],
        codeTemplate: 'import socket\nimport threading\n\nclass ChatServer:\n    def __init__(self, host, port):\n        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        self.clients = {}\n        # TODO: 绑定和监听\n\n    def handle_client(self, conn, addr):\n        # TODO: 处理客户端消息\n        pass',
        checkpoint: '服务器能同时接受多个客户端连接'
      },
      {
        stepIndex: 1,
        title: '实现消息广播与私聊',
        description: '服务器转发消息，支持群聊广播和指定用户的私聊。',
        hints: [
          '群聊消息转发给除发送者外的所有客户端',
          '私聊消息格式如"@用户名 消息内容"',
          '使用字典维护用户名到连接的映射'
        ],
        codeTemplate: 'def broadcast(self, message, sender=None):\n    # TODO: 广播消息给所有客户端\n    pass\n\ndef private_message(self, message, target, sender):\n    # TODO: 发送私聊消息\n    pass',
        checkpoint: '群聊和私聊功能正常，消息正确转发'
      },
      {
        stepIndex: 2,
        title: '实现TCP客户端',
        description: '创建客户端程序，支持发送和接收消息。',
        hints: [
          '使用两个线程分别处理发送和接收',
          '接收线程持续监听服务器消息并显示',
          '发送线程读取用户输入并发送'
        ],
        codeTemplate: 'class ChatClient:\n    def __init__(self, host, port, username):\n        # TODO: 连接服务器\n        pass\n\n    def receive(self):\n        # TODO: 接收消息线程\n        pass\n\n    def send(self):\n        # TODO: 发送消息线程\n        pass',
        checkpoint: '客户端能正常收发消息，多用户聊天流畅'
      }
    ]
  },
  {
    id: 'lab-c10-2',
    courseId: 10,
    title: 'HTTP服务器',
    description: '从零实现一个简易HTTP服务器，理解HTTP协议的工作原理。',
    difficulty: '入门',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '解析HTTP请求',
        description: '接收并解析HTTP请求报文，提取请求方法、URL和头部。',
        hints: [
          '请求行格式：METHOD URL HTTP/1.1\\r\\n',
          '头部字段格式：Key: Value\\r\\n',
          '头部与正文以\\r\\n\\r\\n分隔'
        ],
        codeTemplate: 'def parse_request(data):\n    lines = data.split("\\r\\n")\n    # TODO: 解析请求行\n    # TODO: 解析头部字段\n    return method, url, headers, body',
        checkpoint: '能正确解析GET和POST请求'
      },
      {
        stepIndex: 1,
        title: '构建HTTP响应',
        description: '根据请求内容构建HTTP响应报文，支持多种状态码和内容类型。',
        hints: [
          '响应行格式：HTTP/1.1 200 OK\\r\\n',
          'Content-Type指定响应内容的MIME类型',
          'Content-Length指定响应正文的字节长度'
        ],
        codeTemplate: 'def build_response(status_code, content, content_type="text/html"):\n    # TODO: 构建响应报文\n    pass',
        checkpoint: '响应报文格式正确，浏览器能正常显示'
      },
      {
        stepIndex: 2,
        title: '实现路由与文件服务',
        description: '实现URL路由分发和静态文件服务功能。',
        hints: [
          '根据URL路径映射到不同的处理函数',
          '静态文件需读取文件内容并设置正确的Content-Type',
          '不存在的路径返回404响应'
        ],
        codeTemplate: 'def handle_request(method, url, headers, body):\n    routes = {\n        "/": home_handler,\n        "/about": about_handler,\n    }\n    # TODO: 路由分发和文件服务\n    pass',
        checkpoint: '路由功能正常，静态文件能正确返回'
      }
    ]
  },
  {
    id: 'lab-c11-1',
    courseId: 11,
    title: 'SQL查询优化',
    description: '学习SQL查询优化技巧，通过实际案例理解索引、执行计划等优化手段。',
    difficulty: '进阶',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '创建测试数据库',
        description: '创建包含大量数据的测试表，为优化实验准备数据。',
        hints: [
          '使用INSERT批量插入数据，可编写存储过程生成',
          '设计合理的表结构，包含主键、外键关系',
          '数据量应足够大以体现查询性能差异'
        ],
        codeTemplate: 'CREATE TABLE students (\n    id INT PRIMARY KEY,\n    name VARCHAR(100),\n    department_id INT,\n    gpa DECIMAL(3,2),\n    enrollment_date DATE\n);\n\nCREATE TABLE departments (\n    id INT PRIMARY KEY,\n    name VARCHAR(50)\n);\n\n-- TODO: 插入测试数据',
        checkpoint: '测试表创建成功，数据量满足实验需求'
      },
      {
        stepIndex: 1,
        title: '分析执行计划',
        description: '使用EXPLAIN分析查询的执行计划，识别性能瓶颈。',
        hints: [
          'EXPLAIN查看查询的执行路径',
          '关注type列：ALL表示全表扫描，需要优化',
          '关注rows列：预估扫描行数，越少越好'
        ],
        codeTemplate: '-- 查看执行计划\nEXPLAIN SELECT * FROM students WHERE name = \'张三\';\n\n-- TODO: 分析并记录执行计划',
        checkpoint: '能读懂执行计划，识别全表扫描等低效操作'
      },
      {
        stepIndex: 2,
        title: '创建索引并优化',
        description: '创建合适的索引优化查询，对比优化前后的性能差异。',
        hints: [
          '在WHERE条件列上创建索引',
          '多列查询考虑复合索引，注意最左前缀原则',
          '使用覆盖索引避免回表查询'
        ],
        codeTemplate: '-- 创建索引\nCREATE INDEX idx_name ON students(name);\nCREATE INDEX idx_dept_gpa ON students(department_id, gpa);\n\n-- 对比查询性能\n-- TODO: 执行优化前后的查询并对比耗时',
        checkpoint: '索引创建合理，查询性能明显提升'
      }
    ]
  },
  {
    id: 'lab-c11-2',
    courseId: 11,
    title: '事务隔离实验',
    description: '通过实验理解数据库事务的四种隔离级别及各并发问题。',
    difficulty: '高级',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '设置隔离级别',
        description: '了解并设置不同的数据库隔离级别。',
        hints: [
          'MySQL使用SET TRANSACTION ISOLATION LEVEL设置',
          '四种级别：READ UNCOMMITTED、READ COMMITTED、REPEATABLE READ、SERIALIZABLE',
          'MySQL默认隔离级别是REPEATABLE READ'
        ],
        codeTemplate: '-- 查看当前隔离级别\nSELECT @@transaction_isolation;\n\n-- 设置隔离级别\nSET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;\n\n-- TODO: 分别设置四种隔离级别',
        checkpoint: '能正确设置和查看隔离级别'
      },
      {
        stepIndex: 1,
        title: '模拟脏读现象',
        description: '在READ UNCOMMITTED级别下模拟脏读问题。',
        hints: [
          '事务A修改数据但未提交，事务B能读到未提交的数据',
          '事务A回滚后，事务B读到的数据就是脏数据',
          '使用两个终端窗口模拟两个并发事务'
        ],
        codeTemplate: '-- 事务A\nSTART TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\n-- 不提交，等待事务B读取\n\n-- 事务B（READ UNCOMMITTED）\nSTART TRANSACTION;\nSELECT balance FROM accounts WHERE id = 1;\n-- TODO: 观察是否读到未提交数据',
        checkpoint: '成功复现脏读现象，理解其产生原因'
      },
      {
        stepIndex: 2,
        title: '模拟不可重复读与幻读',
        description: '在不同隔离级别下观察不可重复读和幻读现象。',
        hints: [
          '不可重复读：同一事务中两次读取同一行数据结果不同（UPDATE导致）',
          '幻读：同一事务中两次查询结果集行数不同（INSERT/DELETE导致）',
          'REPEATABLE READ可防止不可重复读，但可能出现幻读'
        ],
        codeTemplate: '-- 不可重复读实验\n-- 事务A：两次查询同一行\n-- 事务B：在两次查询之间修改该行\n\n-- 幻读实验\n-- 事务A：两次范围查询\n-- 事务B：在两次查询之间插入新行\n\n-- TODO: 分别在不同隔离级别下测试',
        checkpoint: '能区分脏读、不可重复读和幻读，理解隔离级别的作用'
      }
    ]
  },
  {
    id: 'lab-c12-1',
    courseId: 12,
    title: '需求文档编写',
    description: '针对一个在线图书管理系统，编写完整的软件需求规格说明书。',
    difficulty: '入门',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '需求获取与分类',
        description: '识别系统的功能需求和非功能需求，进行分类整理。',
        hints: [
          '功能需求描述系统"做什么"，如用户注册、图书搜索',
          '非功能需求描述系统"做到什么程度"，如性能、安全性',
          '使用用户故事格式：作为XX，我希望XX，以便XX'
        ],
        codeTemplate: '需求列表模板：\n\n## 功能需求\nFR-01: 用户注册与登录\n  作为读者，我希望注册账号并登录，以便使用系统功能\n\nFR-02: 图书搜索\n  作为读者，我希望按书名或作者搜索图书，以便快速找到目标\n\n## 非功能需求\nNFR-01: 响应时间\n  页面加载时间不超过2秒\n\nNFR-02: 并发能力\n  系统支持至少500用户同时在线',
        checkpoint: '需求分类清晰，覆盖主要功能和关键非功能需求'
      },
      {
        stepIndex: 1,
        title: '编写用例图与用例描述',
        description: '绘制系统用例图，编写核心用例的详细描述。',
        hints: [
          '用例图展示参与者与用例的关系',
          '用例描述包含：前置条件、主流程、备选流程、后置条件',
          '识别参与者：读者、管理员、系统'
        ],
        codeTemplate: '用例描述模板：\n\n用例名称：借阅图书\n参与者：读者\n前置条件：读者已登录，图书可借\n主流程：\n  1. 读者搜索目标图书\n  2. 系统显示图书详情和库存状态\n  3. 读者点击借阅\n  4. 系统创建借阅记录并更新库存\n备选流程：\n  3a. 图书无库存，提示预约\n后置条件：借阅记录已创建',
        checkpoint: '用例描述完整，主流程和备选流程覆盖关键场景'
      },
      {
        stepIndex: 2,
        title: '需求评审与追踪',
        description: '建立需求追踪矩阵，确保需求的完整性和可追踪性。',
        hints: [
          '追踪矩阵将需求与设计、代码、测试用例关联',
          '评审关注需求的完整性、一致性和可测试性',
          '每条需求应有唯一编号和优先级'
        ],
        codeTemplate: '需求追踪矩阵：\n\n| 需求ID | 需求描述 | 优先级 | 设计文档 | 代码模块 | 测试用例 |\n|--------|----------|--------|----------|----------|----------|\n| FR-01  | 用户注册 | 高     | SD-01    | Auth     | TC-01    |\n| FR-02  | 图书搜索 | 高     | SD-02    | Search   | TC-02    |',
        checkpoint: '追踪矩阵完整，需求与设计、代码、测试对应关系清晰'
      }
    ]
  },
  {
    id: 'lab-c12-2',
    courseId: 12,
    title: 'UML建模',
    description: '使用UML图对在线图书管理系统进行面向对象建模。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '绘制类图',
        description: '识别系统核心类，绘制UML类图展示类之间的关系。',
        hints: [
          '核心类：User、Book、Loan、Reservation',
          '关系类型：关联、聚合、组合、继承',
          '标注关键属性和方法'
        ],
        codeTemplate: '类定义：\n\nclass User:\n    - userId: String\n    - name: String\n    - email: String\n    + login(): boolean\n    + searchBook(keyword): List<Book>\n\nclass Book:\n    - isbn: String\n    - title: String\n    - author: String\n    - status: BookStatus\n    + getDetail(): BookDetail\n\nclass Loan:\n    - loanId: String\n    - borrowDate: Date\n    - dueDate: Date\n    + isOverdue(): boolean\n    + returnBook(): void',
        checkpoint: '类图完整，类关系正确，属性和方法标注清晰'
      },
      {
        stepIndex: 1,
        title: '绘制顺序图',
        description: '绘制借书和还书流程的UML顺序图。',
        hints: [
          '顺序图展示对象间的消息传递时序',
          '从上到下表示时间顺序',
          '包含返回消息和条件分支'
        ],
        codeTemplate: '借书流程顺序：\n1. 读者 -> 界面：搜索图书\n2. 界面 -> 控制器：searchBook(keyword)\n3. 控制器 -> 图书DAO：findByKeyword(keyword)\n4. 图书DAO -> 控制器：返回图书列表\n5. 读者 -> 界面：选择借阅\n6. 界面 -> 控制器：createLoan(userId, bookId)\n7. 控制器 -> 借阅DAO：save(loan)\n8. 控制器 -> 图书DAO：updateStatus(bookId, BORROWED)',
        checkpoint: '顺序图流程完整，消息传递关系正确'
      },
      {
        stepIndex: 2,
        title: '绘制状态图',
        description: '绘制图书和借阅记录的状态图。',
        hints: [
          '图书状态：可借→借出→归还→可借',
          '借阅状态：活跃→逾期→归还',
          '标注触发状态转换的事件和条件'
        ],
        codeTemplate: '图书状态图：\n[可借] --借出--> [借出]\n[借出] --归还--> [可借]\n[借出] --预约--> [借出/已预约]\n[可借] --预约--> [已预约]\n[已预约] --取消预约--> [可借]\n\n借阅状态图：\n[活跃] --超期--> [逾期]\n[活跃] --归还--> [已归还]\n[逾期] --归还--> [已归还]\n[逾期] --续借--> [活跃]',
        checkpoint: '状态转换完整，事件和条件标注准确'
      }
    ]
  },
  {
    id: 'lab-c13-1',
    courseId: 13,
    title: '单元测试编写',
    description: '学习使用pytest编写单元测试，掌握测试用例设计和断言技巧。',
    difficulty: '入门',
    estimatedMinutes: 30,
    steps: [
      {
        stepIndex: 0,
        title: '搭建测试环境',
        description: '安装pytest，创建测试目录结构，编写第一个测试。',
        hints: [
          'pip install pytest安装测试框架',
          '测试文件以test_开头，测试函数以test_开头',
          '使用assert语句进行断言'
        ],
        codeTemplate: 'def add(a, b):\n    return a + b\n\ndef test_add():\n    assert add(1, 2) == 3\n    assert add(-1, 1) == 0\n    assert add(0, 0) == 0',
        checkpoint: 'pytest能正确运行测试，断言通过'
      },
      {
        stepIndex: 1,
        title: '参数化与夹具',
        description: '使用pytest的参数化和fixture功能编写高效测试。',
        hints: [
          '@pytest.mark.parametrize实现参数化测试',
          '@pytest.fixture提供测试前置条件和清理',
          'fixture可通过参数注入到测试函数中'
        ],
        codeTemplate: 'import pytest\n\n@pytest.mark.parametrize("a,b,expected", [\n    (1, 2, 3),\n    (-1, 1, 0),\n    (100, 200, 300),\n])\ndef test_add_parametrized(a, b, expected):\n    assert add(a, b) == expected\n\n@pytest.fixture\ndef sample_data():\n    return [1, 2, 3, 4, 5]\n\ndef test_sum(sample_data):\n    assert sum(sample_data) == 15',
        checkpoint: '参数化测试覆盖多组数据，fixture正确提供测试数据'
      },
      {
        stepIndex: 2,
        title: '测试覆盖与异常测试',
        description: '使用pytest-cov检查覆盖率，编写异常场景的测试。',
        hints: [
          'pytest --cov查看代码覆盖率',
          'pytest.raises测试预期异常',
          '目标覆盖率80%以上'
        ],
        codeTemplate: 'import pytest\n\ndef divide(a, b):\n    if b == 0:\n        raise ValueError("除数不能为零")\n    return a / b\n\ndef test_divide_by_zero():\n    with pytest.raises(ValueError, match="除数不能为零"):\n        divide(1, 0)',
        checkpoint: '异常测试通过，代码覆盖率达到目标'
      }
    ]
  },
  {
    id: 'lab-c13-2',
    courseId: 13,
    title: '自动化测试',
    description: '使用Selenium实现Web应用的自动化测试，掌握端到端测试方法。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '搭建Selenium环境',
        description: '安装Selenium和浏览器驱动，编写基础自动化脚本。',
        hints: [
          'pip install selenium安装Selenium库',
          '下载对应版本的ChromeDriver',
          '使用webdriver.Chrome()启动浏览器'
        ],
        codeTemplate: 'from selenium import webdriver\nfrom selenium.webdriver.common.by import By\n\ndriver = webdriver.Chrome()\ndriver.get("https://example.com")\nprint(driver.title)\ndriver.quit()',
        checkpoint: 'Selenium能成功启动浏览器并访问页面'
      },
      {
        stepIndex: 1,
        title: '实现页面交互测试',
        description: '编写测试脚本模拟用户操作：点击、输入、表单提交。',
        hints: [
          'find_element(By.ID, "xxx")定位元素',
          'send_keys()输入文本，click()点击',
          '使用WebDriverWait显式等待元素加载'
        ],
        codeTemplate: 'from selenium.webdriver.support.ui import WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\n\ndef test_login():n    driver.get("https://example.com/login")\n    # TODO: 输入用户名和密码\n    # TODO: 点击登录按钮\n    # TODO: 验证登录成功',
        checkpoint: '自动化操作流畅，页面交互正确'
      },
      {
        stepIndex: 2,
        title: '实现断言与测试报告',
        description: '添加测试断言，生成自动化测试报告。',
        hints: [
          '使用assert验证页面标题、元素文本等',
          'pytest-html插件生成HTML测试报告',
          '截图功能用于失败时记录现场'
        ],
        codeTemplate: 'def test_search():\n    driver.get("https://example.com")\n    search_box = driver.find_element(By.NAME, "q")\n    search_box.send_keys("selenium")\n    search_box.submit()\n    # TODO: 断言搜索结果\n    assert "selenium" in driver.title.lower()',
        checkpoint: '断言准确，测试报告生成成功'
      }
    ]
  },
  {
    id: 'lab-c14-1',
    courseId: 14,
    title: '逻辑推理',
    description: '使用命题逻辑和谓词逻辑进行形式化推理，实现自动推理程序。',
    difficulty: '入门',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '实现命题逻辑求值',
        description: '实现命题逻辑的语法解析和真值求值。',
        hints: [
          '支持与(∧)、或(∨)、非(¬)、蕴含(→)运算',
          '使用递归下降法解析逻辑表达式',
          '真值表枚举所有赋值组合'
        ],
        codeTemplate: 'def evaluate(expr, assignment):\n    # TODO: 递归求值逻辑表达式\n    pass\n\ndef truth_table(expr, variables):\n    # TODO: 生成真值表\n    pass',
        checkpoint: '能正确求值逻辑表达式，真值表生成无误'
      },
      {
        stepIndex: 1,
        title: '实现推理规则',
        description: '实现假言推理(MP)、假言拒取(MT)等基本推理规则。',
        hints: [
          'MP：P→Q, P ⊢ Q',
          'MT：P→Q, ¬Q ⊢ ¬P',
          '使用集合表示知识库，逐步应用推理规则'
        ],
        codeTemplate: 'def modus_ponens(implication, premise):\n    # implication: (P, Q), premise: P\n    # TODO: 如果前提匹配，返回Q\n    pass\n\ndef modus_tollens(implication, negation):\n    # implication: (P, Q), negation: ¬Q\n    # TODO: 如果否命题匹配，返回¬P\n    pass',
        checkpoint: '推理规则实现正确，能从前提推出结论'
      },
      {
        stepIndex: 2,
        title: '实现归结推理',
        description: '实现归结原理，自动判断逻辑公式的可满足性。',
        hints: [
          '将公式转为合取范式(CNF)',
          '归结规则：从(A∨C)和(¬A∨D)推出(C∨D)',
          '若归结出空子句，则原公式不可满足'
        ],
        codeTemplate: 'def to_cnf(expr):\n    # TODO: 转换为合取范式\n    pass\n\ndef resolve(clause1, clause2):\n    # TODO: 对两个子句进行归结\n    pass\n\ndef resolution(kb, query):\n    # TODO: 归结推理判断查询是否成立\n    pass',
        checkpoint: '归结推理能正确判断公式的可满足性'
      }
    ]
  },
  {
    id: 'lab-c14-2',
    courseId: 14,
    title: '图论算法',
    description: '实现最小生成树和拓扑排序等经典图论算法。',
    difficulty: '进阶',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '实现最小生成树',
        description: '实现Prim和Kruskal最小生成树算法。',
        hints: [
          'Prim从任一顶点出发，每次选最近的新顶点',
          'Kruskal按边权排序，依次加入不形成环的边',
          'Kruskal需要并查集判断是否形成环'
        ],
        codeTemplate: 'def prim(graph):\n    # TODO: Prim算法\n    pass\n\ndef kruskal(graph):\n    # TODO: Kruskal算法\n    pass',
        checkpoint: '两种算法均能正确求出最小生成树'
      },
      {
        stepIndex: 1,
        title: '实现拓扑排序',
        description: '实现有向无环图的拓扑排序算法。',
        hints: [
          'Kahn算法：不断删除入度为0的顶点',
          'DFS算法：按完成时间的逆序排列',
          '若无法排序所有顶点，说明图中有环'
        ],
        codeTemplate: 'def topological_sort(graph):\n    # TODO: 拓扑排序\n    pass',
        checkpoint: '拓扑排序结果正确，能检测环的存在'
      }
    ]
  },
  {
    id: 'lab-c15-1',
    courseId: 15,
    title: '贝叶斯分类器',
    description: '实现朴素贝叶斯分类器，应用于文本分类任务。',
    difficulty: '进阶',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '数据预处理',
        description: '对文本数据进行分词、去停用词和特征提取。',
        hints: [
          '使用jieba进行中文分词',
          '去除标点和停用词减少噪声',
          '使用词频或TF-IDF作为特征'
        ],
        codeTemplate: 'import jieba\n\ndef preprocess(texts):\n    stop_words = set(["的", "了", "在", "是", "我"])\n    result = []\n    for text in texts:\n        words = jieba.lcut(text)\n        words = [w for w in words if w not in stop_words and len(w) > 1]\n        result.append(words)\n    return result',
        checkpoint: '文本预处理完整，分词和去停用词效果良好'
      },
      {
        stepIndex: 1,
        title: '训练朴素贝叶斯',
        description: '计算先验概率和条件概率，训练分类器。',
        hints: [
          '先验概率P(C) = 类别C的文档数 / 总文档数',
          '条件概率P(w|C)使用拉普拉斯平滑',
          '取对数避免下溢问题'
        ],
        codeTemplate: 'import numpy as np\nfrom collections import Counter, defaultdict\n\nclass NaiveBayes:\n    def fit(self, X, y):\n        # TODO: 计算先验概率和条件概率\n        pass\n\n    def predict(self, X):\n        # TODO: 对数概率计算并预测\n        pass',
        checkpoint: '分类器训练完成，预测结果合理'
      },
      {
        stepIndex: 2,
        title: '评估分类性能',
        description: '使用准确率、精确率、召回率和F1值评估分类器。',
        hints: [
          '混淆矩阵是评估的基础',
          '精确率 = TP / (TP + FP)',
          'F1 = 2 * 精确率 * 召回率 / (精确率 + 召回率)'
        ],
        codeTemplate: 'from sklearn.metrics import classification_report\n\ndef evaluate(y_true, y_pred):\n    # TODO: 计算各项指标\n    print(classification_report(y_true, y_pred))',
        checkpoint: '评估指标计算正确，分类器性能达标'
      }
    ]
  },
  {
    id: 'lab-c15-2',
    courseId: 15,
    title: '假设检验',
    description: '使用Python实现常见的统计假设检验方法。',
    difficulty: '入门',
    estimatedMinutes: 30,
    steps: [
      {
        stepIndex: 0,
        title: '实现t检验',
        description: '实现单样本和双样本t检验，判断均值差异的显著性。',
        hints: [
          '单样本t检验：比较样本均值与理论值',
          '双样本t检验：比较两组样本均值是否有显著差异',
          'p值小于显著性水平α则拒绝原假设'
        ],
        codeTemplate: 'from scipy import stats\nimport numpy as np\n\ndef one_sample_ttest(sample, pop_mean, alpha=0.05):\n    # TODO: 单样本t检验\n    t_stat, p_value = stats.ttest_1samp(sample, pop_mean)\n    return t_stat, p_value, p_value < alpha\n\ndef two_sample_ttest(sample1, sample2, alpha=0.05):\n    # TODO: 双样本t检验\n    pass',
        checkpoint: 't检验结果正确，统计结论合理'
      },
      {
        stepIndex: 1,
        title: '实现卡方检验',
        description: '实现卡方独立性检验和拟合优度检验。',
        hints: [
          '独立性检验：检验两个分类变量是否独立',
          '拟合优度检验：检验观测频率是否符合期望分布',
          '使用scipy.stats.chi2_contingency进行独立性检验'
        ],
        codeTemplate: 'def chi2_independence(observed, alpha=0.05):\n    # TODO: 卡方独立性检验\n    pass\n\ndef chi2_goodness_of_fit(observed, expected, alpha=0.05):\n    # TODO: 卡方拟合优度检验\n    pass',
        checkpoint: '卡方检验结果正确，能正确解读检验结论'
      },
      {
        stepIndex: 2,
        title: '实现方差分析',
        description: '实现单因素方差分析(ANOVA)，比较多组均值差异。',
        hints: [
          '原假设：所有组均值相等',
          '计算组间方差和组内方差',
          'F统计量 = 组间均方 / 组内均方'
        ],
        codeTemplate: 'def one_way_anova(*groups, alpha=0.05):\n    # TODO: 单因素方差分析\n    f_stat, p_value = stats.f_oneway(*groups)\n    return f_stat, p_value, p_value < alpha',
        checkpoint: 'ANOVA结果正确，能判断组间差异的显著性'
      }
    ]
  },
  {
    id: 'lab-c16-1',
    courseId: 16,
    title: 'A*搜索实现',
    description: '实现A*搜索算法，应用于迷宫寻路问题。',
    difficulty: '入门',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '定义迷宫与状态表示',
        description: '设计迷宫数据结构和状态表示方式。',
        hints: [
          '使用二维数组表示迷宫，0为通路，1为墙壁',
          '状态用坐标(row, col)表示',
          '定义起点和终点坐标'
        ],
        codeTemplate: 'maze = [\n    [0, 1, 0, 0, 0],\n    [0, 1, 0, 1, 0],\n    [0, 0, 0, 1, 0],\n    [1, 1, 0, 1, 0],\n    [0, 0, 0, 0, 0],\n]\nstart = (0, 0)\ngoal = (4, 4)',
        checkpoint: '迷宫表示正确，起点终点定义清晰'
      },
      {
        stepIndex: 1,
        title: '实现启发函数',
        description: '实现曼哈顿距离和欧几里得距离两种启发函数。',
        hints: [
          '曼哈顿距离：|dx| + |dy|，适合四方向移动',
          '欧几里得距离：sqrt(dx² + dy²)，适合八方向移动',
          '启发函数必须可接纳（不高估实际代价）'
        ],
        codeTemplate: 'def manhattan(a, b):\n    # TODO: 曼哈顿距离\n    pass\n\ndef euclidean(a, b):\n    # TODO: 欧几里得距离\n    pass',
        checkpoint: '启发函数计算正确，满足可接纳性'
      },
      {
        stepIndex: 2,
        title: '实现A*搜索',
        description: '使用优先队列实现A*搜索，找到最短路径。',
        hints: [
          'f(n) = g(n) + h(n)，g为实际代价，h为启发估计',
          '使用heapq实现优先队列',
          '记录每个节点的g值，发现更优路径时更新'
        ],
        codeTemplate: 'import heapq\n\ndef astar(maze, start, goal, heuristic=manhattan):\n    open_list = [(0, start)]\n    g_score = {start: 0}\n    came_from = {}\n    # TODO: 实现A*搜索\n    return reconstruct_path(came_from, goal)',
        checkpoint: 'A*搜索能找到最短路径，搜索效率优于BFS'
      }
    ]
  },
  {
    id: 'lab-c16-2',
    courseId: 16,
    title: '简单神经网络',
    description: '从零实现一个多层感知器，理解前向传播和反向传播原理。',
    difficulty: '高级',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '实现前向传播',
        description: '实现神经网络的前向传播计算。',
        hints: [
          '每层计算：z = Wx + b, a = σ(z)',
          '常用激活函数：sigmoid、ReLU',
          '逐层计算，保存中间结果用于反向传播'
        ],
        codeTemplate: 'import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\ndef forward(X, weights, biases):\n    activations = [X]\n    # TODO: 逐层前向传播\n    return activations',
        checkpoint: '前向传播输出维度正确，激活值范围合理'
      },
      {
        stepIndex: 1,
        title: '实现反向传播',
        description: '实现反向传播算法计算梯度，更新权重。',
        hints: [
          '输出层误差：δ = (a - y) * σ\'(z)',
          '隐藏层误差：δ = (W^T * δ_next) * σ\'(z)',
          '梯度：∂L/∂W = δ * a^T'
        ],
        codeTemplate: 'def backward(activations, y, weights):\n    grads_w = []\n    grads_b = []\n    # TODO: 反向传播计算梯度\n    return grads_w, grads_b',
        checkpoint: '梯度计算正确，数值梯度验证通过'
      },
      {
        stepIndex: 2,
        title: '训练与评估',
        description: '使用梯度下降训练网络，在XOR或MNIST上测试。',
        hints: [
          '学习率影响收敛速度和稳定性',
          'XOR问题需要至少一个隐藏层',
          '损失函数使用均方误差或交叉熵'
        ],
        codeTemplate: 'def train(X, y, layers, epochs, lr):\n    # TODO: 初始化权重\n    for epoch in range(epochs):\n        # TODO: 前向传播、反向传播、更新权重\n        pass\n    return weights, biases',
        checkpoint: '网络能学习XOR或简单分类任务，损失逐步下降'
      }
    ]
  },
  {
    id: 'lab-c17-1',
    courseId: 17,
    title: 'KNN分类器',
    description: '从零实现K近邻分类器，理解距离度量和K值选择的影响。',
    difficulty: '入门',
    estimatedMinutes: 30,
    steps: [
      {
        stepIndex: 0,
        title: '实现距离计算',
        description: '实现欧几里得距离和曼哈顿距离函数。',
        hints: [
          '欧几里得距离：sqrt(Σ(xi-yi)²)',
          '曼哈顿距离：Σ|xi-yi|',
          '注意特征尺度不同时需要归一化'
        ],
        codeTemplate: 'import numpy as np\n\ndef euclidean_distance(a, b):\n    # TODO: 欧几里得距离\n    pass\n\ndef manhattan_distance(a, b):\n    # TODO: 曼哈顿距离\n    pass',
        checkpoint: '距离计算正确，与numpy实现结果一致'
      },
      {
        stepIndex: 1,
        title: '实现KNN预测',
        description: '实现KNN分类器的预测逻辑。',
        hints: [
          '计算待预测样本与所有训练样本的距离',
          '选取距离最近的K个邻居',
          '多数投票决定分类结果'
        ],
        codeTemplate: 'class KNNClassifier:\n    def __init__(self, k=3, distance=euclidean_distance):\n        self.k = k\n        self.distance = distance\n\n    def fit(self, X, y):\n        self.X_train = X\n        self.y_train = y\n\n    def predict(self, X):\n        # TODO: 对每个样本进行KNN预测\n        pass',
        checkpoint: 'KNN预测结果正确，与sklearn结果一致'
      },
      {
        stepIndex: 2,
        title: 'K值选择与交叉验证',
        description: '使用交叉验证选择最优K值，分析K值对分类效果的影响。',
        hints: [
          'K太小容易过拟合，K太大容易欠拟合',
          '使用K折交叉验证评估不同K值',
          '绘制K值与准确率的关系曲线'
        ],
        codeTemplate: 'def cross_validate(X, y, k_values, n_folds=5):\n    # TODO: 交叉验证选择最优K\n    pass',
        checkpoint: '找到最优K值，交叉验证结果合理'
      }
    ]
  },
  {
    id: 'lab-c17-2',
    courseId: 17,
    title: '决策树实现',
    description: '从零实现ID3/C4.5决策树算法，理解信息增益和剪枝。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '实现信息熵计算',
        description: '实现信息熵和信息增益的计算函数。',
        hints: [
          '熵：H(D) = -Σpk * log2(pk)',
          '信息增益：Gain(D, A) = H(D) - Σ(|Dv|/|D|) * H(Dv)',
          '信息增益率 = 信息增益 / 分裂信息'
        ],
        codeTemplate: 'import numpy as np\n\ndef entropy(y):\n    # TODO: 计算信息熵\n    pass\n\ndef info_gain(X, y, feature_idx):\n    # TODO: 计算信息增益\n    pass',
        checkpoint: '熵和信息增益计算正确'
      },
      {
        stepIndex: 1,
        title: '构建决策树',
        description: '递归构建决策树，选择最优特征进行分裂。',
        hints: [
          '递归终止条件：样本同类或无特征可分',
          '每步选择信息增益最大的特征',
          '叶子节点存储多数类别'
        ],
        codeTemplate: 'class DecisionTree:\n    def fit(self, X, y):\n        self.tree = self._build_tree(X, y)\n\n    def _build_tree(self, X, y):\n        # TODO: 递归构建决策树\n        pass\n\n    def predict(self, X):\n        # TODO: 遍历树进行预测\n        pass',
        checkpoint: '决策树构建正确，预测结果准确'
      },
      {
        stepIndex: 2,
        title: '实现剪枝',
        description: '实现预剪枝和后剪枝策略，防止过拟合。',
        hints: [
          '预剪枝：限制树的最大深度或叶子最小样本数',
          '后剪枝：先生成完整树，再自底向上剪去使验证集误差下降的子树',
          '使用验证集评估剪枝效果'
        ],
        codeTemplate: 'def prune(tree, X_val, y_val):\n    # TODO: 后剪枝实现\n    pass',
        checkpoint: '剪枝后验证集准确率提升，过拟合减轻'
      }
    ]
  },
  {
    id: 'lab-c18-1',
    courseId: 18,
    title: 'CNN图像分类',
    description: '使用PyTorch实现卷积神经网络，完成图像分类任务。',
    difficulty: '进阶',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '数据加载与预处理',
        description: '加载图像数据集，进行数据增强和标准化。',
        hints: [
          '使用torchvision.datasets加载CIFAR-10等数据集',
          'transforms.Compose组合多种预处理操作',
          'DataLoader设置batch_size和num_workers'
        ],
        codeTemplate: 'import torch\nfrom torchvision import datasets, transforms\n\ntransform = transforms.Compose([\n    transforms.ToTensor(),\n    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),\n])\n\ntrain_set = datasets.CIFAR10(root="./data", train=True, download=True, transform=transform)\ntrain_loader = torch.utils.data.DataLoader(train_set, batch_size=64, shuffle=True)',
        checkpoint: '数据加载成功，预处理管道配置正确'
      },
      {
        stepIndex: 1,
        title: '构建CNN模型',
        description: '设计卷积神经网络结构，包含卷积层、池化层和全连接层。',
        hints: [
          '卷积层提取特征，池化层降低维度',
          '使用nn.Conv2d、nn.MaxPool2d、nn.Linear',
          '最后全连接层输出维度等于类别数'
        ],
        codeTemplate: 'import torch.nn as nn\n\nclass SimpleCNN(nn.Module):\n    def __init__(self, num_classes=10):\n        super().__init__()\n        self.features = nn.Sequential(\n            nn.Conv2d(3, 32, 3, padding=1),\n            nn.ReLU(),\n            nn.MaxPool2d(2),\n            nn.Conv2d(32, 64, 3, padding=1),\n            nn.ReLU(),\n            nn.MaxPool2d(2),\n        )\n        self.classifier = nn.Sequential(\n            nn.Linear(64 * 8 * 8, 128),\n            nn.ReLU(),\n            nn.Linear(128, num_classes),\n        )\n\n    def forward(self, x):\n        # TODO: 前向传播\n        pass',
        checkpoint: '模型结构合理，能正确处理输入输出'
      },
      {
        stepIndex: 2,
        title: '训练与评估',
        description: '训练CNN模型，评估分类准确率。',
        hints: [
          '使用CrossEntropyLoss和Adam优化器',
          '每个epoch记录训练损失和验证准确率',
          '使用model.eval()切换评估模式'
        ],
        codeTemplate: 'def train_model(model, train_loader, val_loader, epochs=10):\n    criterion = nn.CrossEntropyLoss()\n    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)\n    for epoch in range(epochs):\n        # TODO: 训练循环\n        # TODO: 验证循环\n        pass',
        checkpoint: '模型训练收敛，验证准确率达到合理水平'
      }
    ]
  },
  {
    id: 'lab-c18-2',
    courseId: 18,
    title: 'RNN文本生成',
    description: '使用LSTM实现字符级文本生成模型。',
    difficulty: '高级',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '文本数据预处理',
        description: '将文本转为字符级序列，构建词汇表和训练样本。',
        hints: [
          '建立字符到索引的映射表',
          '将文本切分为固定长度的序列',
          '输入和目标偏移一个字符'
        ],
        codeTemplate: 'def prepare_data(text, seq_length=50):\n    chars = sorted(set(text))\n    char_to_idx = {c: i for i, c in enumerate(chars)}\n    # TODO: 构建训练序列\n    pass',
        checkpoint: '数据预处理正确，训练序列格式符合模型输入'
      },
      {
        stepIndex: 1,
        title: '构建LSTM模型',
        description: '实现LSTM文本生成模型，包含嵌入层、LSTM层和输出层。',
        hints: [
          'nn.Embedding将字符索引转为向量',
          'nn.LSTM处理序列，可设置多层和dropout',
          '输出层将LSTM输出映射到词汇表大小'
        ],
        codeTemplate: 'class TextGenerator(nn.Module):\n    def __init__(self, vocab_size, embed_dim, hidden_dim, num_layers):\n        super().__init__()\n        self.embedding = nn.Embedding(vocab_size, embed_dim)\n        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers, batch_first=True)\n        self.fc = nn.Linear(hidden_dim, vocab_size)\n\n    def forward(self, x, hidden=None):\n        # TODO: 前向传播\n        pass',
        checkpoint: '模型结构正确，能处理序列输入'
      },
      {
        stepIndex: 2,
        title: '训练与生成文本',
        description: '训练模型并实现文本生成功能。',
        hints: [
          '使用temperature参数控制生成多样性',
          '生成时使用前一个输出作为下一个输入',
          '可使用top-k采样提高生成质量'
        ],
        codeTemplate: 'def generate(model, start_text, length, temperature=1.0):\n    model.eval()\n    # TODO: 从起始文本开始逐步生成\n    pass',
        checkpoint: '生成的文本具有一定连贯性和风格特征'
      }
    ]
  },
  {
    id: 'lab-c19-1',
    courseId: 19,
    title: '文本分类',
    description: '实现基于深度学习的中文文本分类系统。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '文本预处理与向量化',
        description: '对中文文本进行分词、编码，转为数值序列。',
        hints: [
          '使用jieba分词，构建词汇表',
          '将文本转为等长索引序列（padding/truncating）',
          '划分训练集和测试集'
        ],
        codeTemplate: 'import jieba\nfrom collections import Counter\n\ndef build_vocab(texts, max_size=10000):\n    # TODO: 构建词汇表\n    pass\n\ndef text_to_sequence(text, vocab, max_len=200):\n    # TODO: 文本转索引序列\n    pass',
        checkpoint: '文本向量化正确，序列长度统一'
      },
      {
        stepIndex: 1,
        title: '构建TextCNN模型',
        description: '实现TextCNN模型，使用多尺度卷积核提取文本特征。',
        hints: [
          '使用不同大小的卷积核(2,3,4,5)捕获不同n-gram特征',
          '每个卷积核后接最大池化提取最重要特征',
          '拼接所有卷积核的输出送入全连接层'
        ],
        codeTemplate: 'class TextCNN(nn.Module):\n    def __init__(self, vocab_size, embed_dim, num_classes, filter_sizes=[2,3,4], num_filters=100):\n        super().__init__()\n        self.embedding = nn.Embedding(vocab_size, embed_dim)\n        self.convs = nn.ModuleList([\n            nn.Conv2d(1, num_filters, (fs, embed_dim)) for fs in filter_sizes\n        ])\n        self.fc = nn.Linear(num_filters * len(filter_sizes), num_classes)\n\n    def forward(self, x):\n        # TODO: 前向传播\n        pass',
        checkpoint: 'TextCNN模型结构正确，能处理文本输入'
      },
      {
        stepIndex: 2,
        title: '训练与评估',
        description: '训练文本分类模型，评估分类效果。',
        hints: [
          '使用交叉熵损失和Adam优化器',
          '监控训练损失和验证准确率',
          '分析混淆矩阵了解分类错误模式'
        ],
        codeTemplate: 'def train_and_evaluate(model, train_loader, test_loader, epochs=10):\n    # TODO: 训练和评估\n    pass',
        checkpoint: '分类准确率达到合理水平，模型收敛'
      }
    ]
  },
  {
    id: 'lab-c19-2',
    courseId: 19,
    title: '词向量训练',
    description: '实现Word2Vec的Skip-gram模型，训练中文词向量。',
    difficulty: '高级',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: '构建训练数据',
        description: '从语料中生成Skip-gram的训练样本（中心词-上下文词对）。',
        hints: [
          '设定窗口大小，提取中心词和上下文词对',
          '使用负采样减少计算量',
          '对高频词进行下采样'
        ],
        codeTemplate: 'def generate_training_data(corpus, vocab, window_size=5):\n    # TODO: 生成(中心词, 上下文词)对\n    pass',
        checkpoint: '训练样本生成正确，正负样本比例合理'
      },
      {
        stepIndex: 1,
        title: '实现Skip-gram模型',
        description: '实现带负采样的Skip-gram模型。',
        hints: [
          '两个嵌入矩阵：中心词和上下文词',
          '正样本目标：σ(v_c · v_w)最大化',
          '负样本目标：σ(-v_c · v_n)最大化'
        ],
        codeTemplate: 'class SkipGramNegSampling(nn.Module):\n    def __init__(self, vocab_size, embed_dim):\n        super().__init__()\n        self.center_embeddings = nn.Embedding(vocab_size, embed_dim)\n        self.context_embeddings = nn.Embedding(vocab_size, embed_dim)\n\n    def forward(self, center, context, negatives):\n        # TODO: 计算损失\n        pass',
        checkpoint: '模型能正确计算损失，梯度回传正常'
      },
      {
        stepIndex: 2,
        title: '训练与评估词向量',
        description: '训练词向量，通过词语相似度和类比任务评估质量。',
        hints: [
          '使用余弦相似度衡量词向量相似性',
          '类比任务：king - man + woman ≈ queen',
          '可视化使用t-SNE降维到二维'
        ],
        codeTemplate: 'def most_similar(word, embeddings, vocab, top_k=10):\n    # TODO: 查找最相似词语\n    pass\n\ndef analogy(a, b, c, embeddings, vocab):\n    # TODO: 词语类比 a:b = c:?\n    pass',
        checkpoint: '词向量能捕获语义关系，类比任务结果合理'
      }
    ]
  },
  {
    id: 'lab-c20-1',
    courseId: 20,
    title: '图像预处理',
    description: '使用OpenCV实现常见的图像预处理操作。',
    difficulty: '入门',
    estimatedMinutes: 30,
    steps: [
      {
        stepIndex: 0,
        title: '图像读取与基本操作',
        description: '读取图像，进行裁剪、缩放、旋转等基本操作。',
        hints: [
          'cv2.imread读取图像，默认BGR格式',
          'cv2.resize缩放，cv2.rotate旋转',
          '使用数组切片进行裁剪'
        ],
        codeTemplate: 'import cv2\nimport numpy as np\n\nimg = cv2.imread("image.jpg")\nresized = cv2.resize(img, (224, 224))\nrotated = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)\ncropped = img[100:300, 200:400]',
        checkpoint: '图像操作正确，结果显示正常'
      },
      {
        stepIndex: 1,
        title: '滤波与边缘检测',
        description: '实现高斯滤波、中值滤波和Canny边缘检测。',
        hints: [
          '高斯滤波用于去噪，cv2.GaussianBlur',
          '中值滤波对椒盐噪声效果好，cv2.medianBlur',
          'Canny边缘检测需要设置高低阈值'
        ],
        codeTemplate: 'blurred = cv2.GaussianBlur(img, (5, 5), 0)\nmedian = cv2.medianBlur(img, 5)\nedges = cv2.Canny(img, 100, 200)',
        checkpoint: '滤波和边缘检测效果合理'
      },
      {
        stepIndex: 2,
        title: '色彩空间转换与直方图',
        description: '实现色彩空间转换和直方图均衡化。',
        hints: [
          'cv2.cvtColor转换色彩空间，如BGR2GRAY、BGR2HSV',
          '直方图均衡化增强对比度：cv2.equalizeHist',
          'CLAHE是自适应的直方图均衡化方法'
        ],
        codeTemplate: 'gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)\nhsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)\nequalized = cv2.equalizeHist(gray)\nclahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))\nclahe_img = clahe.apply(gray)',
        checkpoint: '色彩转换正确，直方图均衡化效果明显'
      }
    ]
  },
  {
    id: 'lab-c20-2',
    courseId: 20,
    title: '目标检测',
    description: '使用YOLO或SSD实现目标检测，理解检测流程。',
    difficulty: '高级',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '加载预训练模型',
        description: '加载YOLO预训练模型和类别标签。',
        hints: [
          '使用ultralytics库加载YOLOv8',
          'COCO数据集有80个类别',
          '模型自动下载权重文件'
        ],
        codeTemplate: 'from ultralytics import YOLO\n\nmodel = YOLO("yolov8n.pt")\nclasses = model.names',
        checkpoint: '模型加载成功，能识别COCO类别'
      },
      {
        stepIndex: 1,
        title: '推理与结果解析',
        description: '对图像进行推理，解析检测框、置信度和类别。',
        hints: [
          'results = model(image)进行推理',
          'results[0].boxes获取检测框信息',
          '每个框包含坐标(xyxy)、置信度(conf)、类别(cls)'
        ],
        codeTemplate: 'def detect_objects(model, image_path, conf_threshold=0.5):\n    results = model(image_path)\n    detections = []\n    for box in results[0].boxes:\n        # TODO: 解析检测结果\n        pass\n    return detections',
        checkpoint: '检测结果解析正确，置信度过滤合理'
      },
      {
        stepIndex: 2,
        title: '可视化与性能评估',
        description: '绘制检测框和标签，计算mAP评估检测性能。',
        hints: [
          '使用cv2.rectangle绘制检测框',
          'cv2.putText添加类别和置信度标签',
          'mAP综合考虑精确率和召回率'
        ],
        codeTemplate: 'def draw_detections(image, detections, class_names):\n    # TODO: 绘制检测框和标签\n    pass',
        checkpoint: '检测结果可视化清晰，评估指标合理'
      }
    ]
  },
  {
    id: 'lab-c21-1',
    courseId: 21,
    title: 'Q-Learning',
    description: '实现Q-Learning算法，训练智能体在网格世界中找到最优路径。',
    difficulty: '入门',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '定义环境',
        description: '创建网格世界环境，定义状态、动作和奖励。',
        hints: [
          '状态用坐标表示，动作为上下左右四个方向',
          '到达目标给正奖励，碰到障碍给负奖励',
          '每步给小负奖励鼓励尽快到达目标'
        ],
        codeTemplate: 'class GridWorld:\n    def __init__(self, rows, cols, obstacles, goal):\n        # TODO: 初始化环境\n        pass\n\n    def step(self, state, action):\n        # TODO: 执行动作，返回下一状态、奖励、是否结束\n        pass\n\n    def reset(self):\n        # TODO: 重置环境\n        pass',
        checkpoint: '环境逻辑正确，奖励设计合理'
      },
      {
        stepIndex: 1,
        title: '实现Q-Learning',
        description: '实现Q-Learning算法，更新Q表。',
        hints: [
          'Q(s,a) = Q(s,a) + α[r + γ max Q(s\',a\') - Q(s,a)]',
          'ε-贪心策略平衡探索与利用',
          'α为学习率，γ为折扣因子'
        ],
        codeTemplate: 'import numpy as np\n\nclass QLearning:\n    def __init__(self, n_states, n_actions, lr=0.1, gamma=0.9, epsilon=0.1):\n        self.q_table = np.zeros((n_states, n_actions))\n        self.lr = lr\n        self.gamma = gamma\n        self.epsilon = epsilon\n\n    def choose_action(self, state):\n        # TODO: ε-贪心选择动作\n        pass\n\n    def update(self, state, action, reward, next_state):\n        # TODO: Q值更新\n        pass',
        checkpoint: 'Q-Learning更新公式正确，Q表逐步收敛'
      },
      {
        stepIndex: 2,
        title: '训练与可视化',
        description: '训练智能体，可视化学习过程和最优路径。',
        hints: [
          '训练多个episode直到收敛',
          '绘制每个episode的总奖励曲线',
          '根据Q表提取最优策略并展示路径'
        ],
        codeTemplate: 'def train(env, agent, episodes=1000):\n    rewards = []\n    for ep in range(episodes):\n        # TODO: 训练循环\n        pass\n    return rewards\n\ndef visualize_policy(q_table, env):\n    # TODO: 可视化最优策略\n    pass',
        checkpoint: '智能体学会最优路径，奖励曲线收敛'
      }
    ]
  },
  {
    id: 'lab-c21-2',
    courseId: 21,
    title: 'GAN生成',
    description: '实现生成对抗网络，生成手写数字图像。',
    difficulty: '高级',
    estimatedMinutes: 55,
    steps: [
      {
        stepIndex: 0,
        title: '构建生成器和判别器',
        description: '设计GAN的生成器网络和判别器网络。',
        hints: [
          '生成器：从随机噪声生成图像，使用转置卷积上采样',
          '判别器：判断图像真假，输出概率值',
          '使用BatchNorm稳定训练'
        ],
        codeTemplate: 'class Generator(nn.Module):\n    def __init__(self, latent_dim, img_shape):\n        super().__init__()\n        # TODO: 定义生成器网络\n\n    def forward(self, z):\n        # TODO: 前向传播\n        pass\n\nclass Discriminator(nn.Module):\n    def __init__(self, img_shape):\n        super().__init__()\n        # TODO: 定义判别器网络\n\n    def forward(self, img):\n        # TODO: 前向传播\n        pass',
        checkpoint: '生成器输出图像尺寸正确，判别器输出概率值'
      },
      {
        stepIndex: 1,
        title: '实现对抗训练',
        description: '实现GAN的对抗训练循环。',
        hints: [
          '先训练判别器：真实图像标签1，生成图像标签0',
          '再训练生成器：希望判别器将生成图像判为1',
          '使用BCELoss作为损失函数'
        ],
        codeTemplate: 'def train_gan(generator, discriminator, dataloader, epochs, latent_dim):\n    g_optimizer = torch.optim.Adam(generator.parameters(), lr=0.0002)\n    d_optimizer = torch.optim.Adam(discriminator.parameters(), lr=0.0002)\n    criterion = nn.BCELoss()\n    for epoch in range(epochs):\n        for real_imgs, _ in dataloader:\n            # TODO: 训练判别器\n            # TODO: 训练生成器\n            pass',
        checkpoint: '判别器和生成器交替训练，损失变化合理'
      },
      {
        stepIndex: 2,
        title: '生成与评估',
        description: '使用训练好的生成器生成图像，评估生成质量。',
        hints: [
          '从随机噪声生成图像并可视化',
          'FID分数衡量生成质量',
          '观察训练过程中生成图像的演变'
        ],
        codeTemplate: 'def generate_images(generator, latent_dim, n_samples=16):\n    generator.eval()\n    with torch.no_grad():\n        z = torch.randn(n_samples, latent_dim)\n        gen_imgs = generator(z)\n    # TODO: 可视化生成图像\n    pass',
        checkpoint: '生成的图像具有手写数字特征，质量逐步提升'
      }
    ]
  },
  {
    id: 'lab-c22-1',
    courseId: 22,
    title: '光线追踪',
    description: '实现基础光线追踪算法，渲染包含球体的简单场景。',
    difficulty: '进阶',
    estimatedMinutes: 50,
    steps: [
      {
        stepIndex: 0,
        title: '定义向量与光线',
        description: '实现三维向量运算和光线数据结构。',
        hints: [
          '向量运算：加减、点乘、叉乘、归一化',
          '光线：origin + t * direction',
          '使用numpy数组表示向量'
        ],
        codeTemplate: 'import numpy as np\n\ndef normalize(v):\n    return v / np.linalg.norm(v)\n\ndef reflect(v, n):\n    # TODO: 反射向量\n    pass\n\nclass Ray:\n    def __init__(self, origin, direction):\n        self.origin = origin\n        self.direction = normalize(direction)\n\n    def at(self, t):\n        return self.origin + t * self.direction',
        checkpoint: '向量运算正确，光线参数化表示无误'
      },
      {
        stepIndex: 1,
        title: '实现光线与球体求交',
        description: '计算光线与球体的交点，获取交点法线和距离。',
        hints: [
          '解二次方程：|P + tD - C|² = r²',
          '判别式小于0则无交点',
          '取最近的正根作为交点'
        ],
        codeTemplate: 'class Sphere:\n    def __init__(self, center, radius, color):\n        self.center = center\n        self.radius = radius\n        self.color = color\n\n    def intersect(self, ray):\n        # TODO: 光线与球体求交\n        pass',
        checkpoint: '求交计算正确，交点和法线准确'
      },
      {
        stepIndex: 2,
        title: '实现着色与渲染',
        description: '实现Phong光照模型，渲染完整场景。',
        hints: [
          '环境光 + 漫反射 + 镜面反射',
          '阴影：从交点向光源发射光线检测遮挡',
          '逐像素生成图像'
        ],
        codeTemplate: 'def trace(ray, objects, lights, depth=0):\n    # TODO: 找最近交点\n    # TODO: 计算光照\n    # TODO: 返回颜色\n    pass\n\ndef render(width, height, camera, objects, lights):\n    image = np.zeros((height, width, 3))\n    for y in range(height):\n        for x in range(width):\n            # TODO: 生成光线并追踪\n            pass\n    return image',
        checkpoint: '渲染图像包含光照、阴影效果，视觉合理'
      }
    ]
  },
  {
    id: 'lab-c22-2',
    courseId: 22,
    title: '变换矩阵',
    description: '实现三维变换矩阵，包括平移、旋转、缩放和投影变换。',
    difficulty: '入门',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '实现基本变换矩阵',
        description: '实现平移、旋转、缩放的4x4齐次变换矩阵。',
        hints: [
          '齐次坐标用4维向量表示3维点',
          '平移矩阵在最后一列设置偏移量',
          '旋转矩阵分别绕x、y、z轴'
        ],
        codeTemplate: 'import numpy as np\n\ndef translate(tx, ty, tz):\n    # TODO: 平移矩阵\n    pass\n\ndef rotate_x(angle):\n    # TODO: 绕X轴旋转矩阵\n    pass\n\ndef rotate_y(angle):\n    # TODO: 绕Y轴旋转矩阵\n    pass\n\ndef scale(sx, sy, sz):\n    # TODO: 缩放矩阵\n    pass',
        checkpoint: '变换矩阵正确，作用于点后结果符合预期'
      },
      {
        stepIndex: 1,
        title: '实现投影变换',
        description: '实现透视投影和正交投影矩阵。',
        hints: [
          '透视投影：近大远小效果',
          '正交投影：平行投影，无透视效果',
          '投影矩阵将视锥体映射到标准化设备坐标[-1,1]³'
        ],
        codeTemplate: 'def perspective(fov, aspect, near, far):\n    # TODO: 透视投影矩阵\n    pass\n\ndef orthographic(left, right, bottom, top, near, far):\n    # TODO: 正交投影矩阵\n    pass',
        checkpoint: '投影矩阵正确，3D点投影到2D结果合理'
      },
      {
        stepIndex: 2,
        title: '变换组合与应用',
        description: '组合多个变换，实现模型-视图-投影(MVP)变换流水线。',
        hints: [
          '变换顺序：先缩放，再旋转，最后平移',
          '矩阵乘法从右到左应用：MVP = Projection * View * Model',
          '观察矩阵可由相机位置和朝向计算'
        ],
        codeTemplate: 'def look_at(eye, target, up):\n    # TODO: 观察矩阵\n    pass\n\ndef mvp_transform(model, view, projection, vertex):\n    # TODO: MVP变换\n    pass',
        checkpoint: 'MVP变换流水线正确，3D场景正确投影到2D'
      }
    ]
  },
  {
    id: 'lab-c23-1',
    courseId: 23,
    title: '加密解密',
    description: '实现经典加密算法和现代对称加密，理解密码学基本原理。',
    difficulty: '入门',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '实现凯撒密码',
        description: '实现凯撒密码的加密和解密，包括暴力破解。',
        hints: [
          '加密：每个字符偏移固定位数',
          '解密：反向偏移相同位数',
          '暴力破解：尝试所有26种可能的偏移量'
        ],
        codeTemplate: 'def caesar_encrypt(text, shift):\n    # TODO: 凯撒加密\n    pass\n\ndef caesar_decrypt(cipher, shift):\n    # TODO: 凯撒解密\n    pass\n\ndef caesar_brute_force(cipher):\n    # TODO: 暴力破解\n    pass',
        checkpoint: '加密解密互为逆操作，暴力破解能找到正确明文'
      },
      {
        stepIndex: 1,
        title: '实现AES加密',
        description: '使用Python的cryptography库实现AES对称加密。',
        hints: [
          '使用Fernet或AES的CBC/CTR模式',
          '密钥必须是固定长度（16/24/32字节）',
          'CBC模式需要初始化向量(IV)'
        ],
        codeTemplate: 'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\nfrom cryptography.hazmat.backends import default_backend\nimport os\n\ndef aes_encrypt(plaintext, key):\n    iv = os.urandom(16)\n    # TODO: AES-CBC加密\n    pass\n\ndef aes_decrypt(ciphertext, key, iv):\n    # TODO: AES-CBC解密\n    pass',
        checkpoint: 'AES加密解密正确，密文无法直接阅读'
      },
      {
        stepIndex: 2,
        title: '实现RSA加密',
        description: '实现RSA非对称加密，理解公钥和私钥的作用。',
        hints: [
          '公钥加密，私钥解密',
          'RSA基于大数分解的困难性',
          '密钥长度至少2048位才安全'
        ],
        codeTemplate: 'from cryptography.hazmat.primitives.asymmetric import rsa, padding\nfrom cryptography.hazmat.primitives import hashes\n\ndef generate_rsa_keys():\n    # TODO: 生成RSA密钥对\n    pass\n\ndef rsa_encrypt(plaintext, public_key):\n    # TODO: RSA公钥加密\n    pass\n\ndef rsa_decrypt(ciphertext, private_key):\n    # TODO: RSA私钥解密\n    pass',
        checkpoint: 'RSA加解密正确，理解公私钥的不同作用'
      }
    ]
  },
  {
    id: 'lab-c23-2',
    courseId: 23,
    title: 'Web安全检测',
    description: '学习常见Web安全漏洞原理，实现基本的SQL注入和XSS检测。',
    difficulty: '进阶',
    estimatedMinutes: 45,
    steps: [
      {
        stepIndex: 0,
        title: 'SQL注入原理与检测',
        description: '理解SQL注入原理，实现基本的注入检测工具。',
        hints: [
          'SQL注入通过构造恶意输入改变SQL语句逻辑',
          '常见payload：\' OR 1=1 --、UNION SELECT等',
          '检测方法：输入特殊字符观察是否产生异常'
        ],
        codeTemplate: 'def detect_sql_injection(url, params):\n    payloads = ["\' OR 1=1 --", "\' UNION SELECT NULL--", "1; DROP TABLE--"]\n    results = []\n    for payload in payloads:\n        # TODO: 注入测试\n        pass\n    return results',
        checkpoint: '能检测出存在SQL注入风险的参数'
      },
      {
        stepIndex: 1,
        title: 'XSS漏洞检测',
        description: '理解跨站脚本攻击原理，实现XSS检测。',
        hints: [
          'XSS通过注入脚本在用户浏览器执行',
          '反射型XSS：恶意脚本在URL参数中',
          '检测方法：提交脚本标签观察是否被执行'
        ],
        codeTemplate: 'def detect_xss(url, params):\n    payloads = ["<script>alert(1)</script>", "<img src=x onerror=alert(1)>"]\n    results = []\n    for payload in payloads:\n        # TODO: XSS测试\n        pass\n    return results',
        checkpoint: '能检测出存在XSS风险的输入点'
      },
      {
        stepIndex: 2,
        title: '安全防护实践',
        description: '实现参数化查询、输入过滤等安全防护措施。',
        hints: [
          'SQL防护：使用参数化查询，永不拼接SQL',
          'XSS防护：对输出进行HTML转义',
          '使用CSP(Content-Security-Policy)头部限制脚本来源'
        ],
        codeTemplate: 'def safe_query(conn, query, params):\n    # TODO: 参数化查询\n    cursor = conn.cursor()\n    cursor.execute(query, params)\n    return cursor.fetchall()\n\ndef escape_html(text):\n    # TODO: HTML转义\n    pass',
        checkpoint: '防护措施有效，恶意输入被正确处理'
      }
    ]
  },
  {
    id: 'lab-c24-1',
    courseId: 24,
    title: 'MapReduce词频统计',
    description: '实现MapReduce编程模型，完成分布式词频统计任务。',
    difficulty: '进阶',
    estimatedMinutes: 40,
    steps: [
      {
        stepIndex: 0,
        title: '实现Map函数',
        description: '实现Map函数，将文本分割为单词并输出键值对。',
        hints: [
          '输入：文档内容（行文本）',
          '输出：(word, 1)键值对列表',
          '注意大小写统一和标点过滤'
        ],
        codeTemplate: 'def mapper(text):\n    words = text.lower().split()\n    result = []\n    for word in words:\n        word = word.strip(".,!?;:\'\"()[]{}")\n        if word:\n            result.append((word, 1))\n    return result',
        checkpoint: 'Map函数输出格式正确，键值对列表完整'
      },
      {
        stepIndex: 1,
        title: '实现Shuffle与Reduce',
        description: '实现Shuffle阶段分组和Reduce阶段聚合。',
        hints: [
          'Shuffle：按key分组，收集所有相同key的value',
          'Reduce：对每个key的value列表求和',
          '使用defaultdict(list)方便分组'
        ],
        codeTemplate: 'from collections import defaultdict\n\ndef shuffle(mapped_data):\n    grouped = defaultdict(list)\n    for key, value in mapped_data:\n        grouped[key].append(value)\n    return grouped\n\ndef reducer(grouped_data):\n    result = {}\n    for key, values in grouped_data.items():\n        result[key] = sum(values)\n    return result',
        checkpoint: 'Shuffle分组正确，Reduce聚合结果准确'
      },
      {
        stepIndex: 2,
        title: '模拟分布式执行',
        description: '模拟多节点并行执行MapReduce任务。',
        hints: [
          '将输入数据分割为多个split',
          '使用multiprocessing模拟多节点并行',
          '合并各Reduce任务的输出'
        ],
        codeTemplate: 'from multiprocessing import Pool\n\ndef mapreduce(texts, num_mappers=4, num_reducers=2):\n    # TODO: 分割数据\n    # TODO: 并行Map\n    # TODO: Shuffle\n    # TODO: 并行Reduce\n    # TODO: 合并结果\n    pass',
        checkpoint: '分布式模拟正确，结果与单机一致'
      }
    ]
  },
  {
    id: 'lab-c24-2',
    courseId: 24,
    title: 'Docker容器部署',
    description: '学习Docker容器化技术，将应用打包为Docker镜像并部署。',
    difficulty: '入门',
    estimatedMinutes: 35,
    steps: [
      {
        stepIndex: 0,
        title: '编写Dockerfile',
        description: '为Python Web应用编写Dockerfile。',
        hints: [
          'FROM指定基础镜像，如python:3.9-slim',
          'WORKDIR设置工作目录',
          'COPY复制代码，RUN安装依赖，CMD启动应用'
        ],
        codeTemplate: 'FROM python:3.9-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD ["python", "app.py"]',
        checkpoint: 'Dockerfile语法正确，能成功构建镜像'
      },
      {
        stepIndex: 1,
        title: '构建与运行容器',
        description: '使用docker命令构建镜像并运行容器。',
        hints: [
          'docker build -t myapp .构建镜像',
          'docker run -p 8000:8000 myapp运行容器',
          '-p映射端口，-v挂载卷，-d后台运行'
        ],
        codeTemplate: '# 构建镜像\ndocker build -t myapp:1.0 .\n\n# 运行容器\ndocker run -d -p 8000:8000 --name myapp myapp:1.0\n\n# 查看运行状态\ndocker ps\n\n# 查看日志\ndocker logs myapp',
        checkpoint: '容器成功运行，应用可通过映射端口访问'
      },
      {
        stepIndex: 2,
        title: 'Docker Compose多服务编排',
        description: '使用Docker Compose编排Web应用和数据库服务。',
        hints: [
          'docker-compose.yml定义多个服务',
          'depends_on设置服务依赖关系',
          '使用环境变量配置数据库连接'
        ],
        codeTemplate: 'version: "3.8"\nservices:\n  web:\n    build: .\n    ports:\n      - "8000:8000"\n    depends_on:\n      - db\n    environment:\n      - DB_HOST=db\n  db:\n    image: postgres:14\n    environment:\n      - POSTGRES_DB=myapp\n      - POSTGRES_PASSWORD=secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:',
        checkpoint: 'Compose编排成功，多服务正常协作'
      }
    ]
  }
]
