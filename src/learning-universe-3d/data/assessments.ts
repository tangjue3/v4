import type { Assessment } from '../types'

export const assessments: Assessment[] = [
  {
    id: 'assess-c1-pre',
    courseId: 1,
    type: 'pre-test',
    title: 'C语言程序设计 - 课前测评',
    questions: [
      {
        id: 'q-c1-pre-1',
        type: 'choice',
        question: 'C语言中，以下哪个是正确的整型变量声明？',
        options: ['int x;', 'integer x;', 'var x: int;', 'Int x;'],
        correctAnswer: 0,
        explanation: 'C语言使用int关键字声明整型变量，C语言区分大小写，Int不是关键字。',
        commonMisconception: '初学者常以为integer或Int也可以用于声明，但C语言只识别小写int。',
        relatedKnowledgePoint: '基本数据类型与变量声明',
        hint: 'C语言的关键字都是小写字母。'
      },
      {
        id: 'q-c1-pre-2',
        type: 'choice',
        question: 'C语言程序的执行总是从哪个函数开始？',
        options: ['start()', 'begin()', 'main()', 'init()'],
        correctAnswer: 2,
        explanation: 'C语言程序总是从main函数开始执行，这是C语言的标准规定。',
        commonMisconception: '有人认为程序从第一个函数开始执行，但实际上C语言规定从main函数开始。',
        relatedKnowledgePoint: '程序结构与main函数',
        hint: '这个函数的名字在英语中是"主要"的意思。'
      },
      {
        id: 'q-c1-pre-3',
        type: 'judge',
        question: 'C语言是一种面向对象的编程语言。',
        correctAnswer: '错误',
        explanation: 'C语言是面向过程的语言，不支持类和对象等面向对象特性。C++才是面向对象的。',
        commonMisconception: '很多人混淆C和C++，以为C语言也支持面向对象。',
        relatedKnowledgePoint: '编程语言范式',
        hint: '想想C语言和C++的区别。'
      },
      {
        id: 'q-c1-pre-4',
        type: 'choice',
        question: '在C语言中，用于单行注释的符号是？',
        options: ['/* */', '//', '#', '--'],
        correctAnswer: 1,
        explanation: 'C99标准引入了//单行注释，/* */是多行注释。#是预处理指令，--是自减运算符。',
        relatedKnowledgePoint: '注释与代码规范',
        hint: 'C99标准新增了哪种注释方式？'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c1-unit',
    courseId: 1,
    type: 'unit-test',
    title: 'C语言程序设计 - 单元测试',
    questions: [
      {
        id: 'q-c1-unit-1',
        type: 'choice',
        question: '以下代码的输出是什么？\nint a = 5, b = 2;\nprintf("%d", a/b);',
        options: ['2.5', '2', '3', '编译错误'],
        correctAnswer: 1,
        explanation: '两个整数相除结果仍为整数，5/2=2，小数部分被截断。',
        commonMisconception: '初学者常以为整数除法会得到浮点结果2.5。',
        relatedKnowledgePoint: '算术运算与类型转换',
        hint: '整数除以整数，结果还是整数。'
      },
      {
        id: 'q-c1-unit-2',
        type: 'choice',
        question: '以下哪个不是C语言的存储类别？',
        options: ['auto', 'static', 'register', 'virtual'],
        correctAnswer: 3,
        explanation: 'C语言的存储类别包括auto、static、register、extern，没有virtual。virtual是C++中用于多态的关键字。',
        relatedKnowledgePoint: '存储类别与作用域',
        hint: '有一个选项是C++的关键字，不是C语言的。'
      },
      {
        id: 'q-c1-unit-3',
        type: 'code',
        question: '写一个函数，接收一个整型数组及其长度，返回数组中的最大值。',
        correctAnswer: '遍历数组比较即可',
        explanation: '使用一个变量记录当前最大值，遍历数组逐个比较更新最大值。',
        relatedKnowledgePoint: '数组与函数',
        codeTemplate: 'int findMax(int arr[], int len) {\n  // 在此编写代码\n}',
        testCases: [
          { input: '[3,1,4,1,5], 5', expected: '5' },
          { input: '[-1,-5,-2], 3', expected: '-1' }
        ],
        hint: '先假设第一个元素是最大值，然后逐个比较。'
      },
      {
        id: 'q-c1-unit-4',
        type: 'choice',
        question: '关于C语言指针，以下说法正确的是？',
        options: [
          '指针变量存储的是数据的值',
          '指针变量存储的是数据的地址',
          '指针只能指向整型变量',
          '指针声明时不需要指定类型'
        ],
        correctAnswer: 1,
        explanation: '指针变量存储的是其所指向数据的内存地址，而不是数据本身的值。指针必须指定类型以确定所指向数据的大小和解释方式。',
        commonMisconception: '初学者常混淆指针存储的地址和地址处的值。',
        relatedKnowledgePoint: '指针基础',
        hint: '指针的核心概念是"地址"。'
      },
      {
        id: 'q-c1-unit-5',
        type: 'judge',
        question: '在C语言中，数组名可以作为指针常量使用。',
        correctAnswer: '正确',
        explanation: '数组名在大多数表达式中会退化为指向数组首元素的指针，但数组名不是指针变量，不能被赋值。',
        relatedKnowledgePoint: '数组与指针的关系',
        hint: '数组名和指针有什么联系？'
      }
    ],
    timeLimitMinutes: 20
  },
  {
    id: 'assess-c2-pre',
    courseId: 2,
    type: 'pre-test',
    title: 'Python程序设计 - 课前测评',
    questions: [
      {
        id: 'q-c2-pre-1',
        type: 'choice',
        question: 'Python中，以下哪种数据类型是不可变的？',
        options: ['list', 'dict', 'set', 'tuple'],
        correctAnswer: 3,
        explanation: 'tuple（元组）是不可变类型，创建后不能修改其元素。list、dict、set都是可变类型。',
        commonMisconception: '有人以为set也是不可变的，但set是可变的，frozenset才是不可变集合。',
        relatedKnowledgePoint: '基本数据类型',
        hint: '哪种类型用圆括号定义？'
      },
      {
        id: 'q-c2-pre-2',
        type: 'choice',
        question: 'Python中用什么关键字定义函数？',
        options: ['function', 'func', 'def', 'define'],
        correctAnswer: 2,
        explanation: 'Python使用def关键字定义函数，后跟函数名和参数列表。',
        relatedKnowledgePoint: '函数定义与调用',
        hint: '这个关键字是"define"的缩写。'
      },
      {
        id: 'q-c2-pre-3',
        type: 'judge',
        question: 'Python是一种编译型语言。',
        correctAnswer: '错误',
        explanation: 'Python是解释型语言，代码由Python解释器逐行执行，不需要预先编译成机器码。',
        commonMisconception: '有人因为Python有.pyc文件而认为它是编译型语言，但.pyc只是字节码缓存。',
        relatedKnowledgePoint: 'Python语言特性',
        hint: '想想Python代码是如何运行的。'
      },
      {
        id: 'q-c2-pre-4',
        type: 'choice',
        question: 'Python中列表推导式的正确写法是？',
        options: [
          '[x for x in range(10)]',
          '{x for x in range(10)}',
          '(x for x in range(10))',
          '<x for x in range(10)>'
        ],
        correctAnswer: 0,
        explanation: '列表推导式使用方括号[]，花括号{}是集合推导式，圆括号()是生成器表达式。',
        relatedKnowledgePoint: '列表推导式',
        hint: '列表用什么符号表示？'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c2-unit',
    courseId: 2,
    type: 'unit-test',
    title: 'Python程序设计 - 单元测试',
    questions: [
      {
        id: 'q-c2-unit-1',
        type: 'choice',
        question: '以下代码的输出是什么？\nprint([1,2,3] + [4,5])',
        options: ['[5,7,3]', '[1,2,3,4,5]', '[[1,2,3],[4,5]]', '报错'],
        correctAnswer: 1,
        explanation: '列表的+运算符实现列表拼接，将两个列表合并为一个新列表。',
        relatedKnowledgePoint: '列表操作',
        hint: '列表的+运算符是拼接操作。'
      },
      {
        id: 'q-c2-unit-2',
        type: 'choice',
        question: 'Python中装饰器(decorator)的作用是？',
        options: [
          '销毁对象',
          '在不修改函数代码的情况下扩展函数功能',
          '声明全局变量',
          '定义类方法'
        ],
        correctAnswer: 1,
        explanation: '装饰器是一种设计模式，允许在不修改原函数代码的情况下为其添加额外功能，使用@语法糖。',
        relatedKnowledgePoint: '装饰器与高阶函数',
        hint: '装饰器就像给函数"穿衣服"，不改变函数本身。'
      },
      {
        id: 'q-c2-unit-3',
        type: 'code',
        question: '编写一个Python函数，接收一个列表，返回其中所有偶数的平方列表。使用列表推导式。',
        correctAnswer: '使用列表推导式筛选偶数并平方',
        explanation: '列表推导式可以同时进行筛选和变换操作：[x**2 for x in lst if x%2==0]',
        relatedKnowledgePoint: '列表推导式与函数式编程',
        codeTemplate: 'def even_squares(lst):\n    # 在此编写代码\n    pass',
        testCases: [
          { input: '[1,2,3,4,5]', expected: '[4, 16]' },
          { input: '[0,1,3,5]', expected: '[0]' }
        ],
        hint: '在列表推导式中加入if条件筛选偶数。'
      },
      {
        id: 'q-c2-unit-4',
        type: 'judge',
        question: 'Python中，==运算符比较的是两个变量的值是否相等，is运算符比较的是两个变量是否指向同一个对象。',
        correctAnswer: '正确',
        explanation: '==比较值相等性，调用__eq__方法；is比较身份标识，即id()是否相同，判断是否为同一对象。',
        commonMisconception: '初学者常混淆==和is的区别，以为它们功能相同。',
        relatedKnowledgePoint: '运算符与对象比较',
        hint: '想想值相等和对象同一的区别。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c3-pre',
    courseId: 3,
    type: 'pre-test',
    title: 'Java面向对象程序设计 - 课前测评',
    questions: [
      {
        id: 'q-c3-pre-1',
        type: 'choice',
        question: 'Java中，哪个关键字用于继承一个类？',
        options: ['implements', 'inherits', 'extends', 'super'],
        correctAnswer: 2,
        explanation: 'Java使用extends关键字继承类，implements用于实现接口。',
        commonMisconception: '初学者常混淆extends和implements的用途。',
        relatedKnowledgePoint: '类的继承',
        hint: 'extends表示"扩展"，用于继承类。'
      },
      {
        id: 'q-c3-pre-2',
        type: 'choice',
        question: 'Java中，方法重写(Override)发生在什么情况下？',
        options: [
          '同一个类中方法名相同参数不同',
          '子类中定义了与父类相同签名的方法',
          '方法名相同返回类型不同',
          '构造函数的参数不同'
        ],
        correctAnswer: 1,
        explanation: '方法重写是子类提供与父类相同签名（方法名、参数列表、返回类型）的方法实现。选项A描述的是方法重载(Overload)。',
        commonMisconception: '很多人混淆重写(Override)和重载(Overload)。',
        relatedKnowledgePoint: '多态与方法重写',
        hint: '重写是父子类之间的关系。'
      },
      {
        id: 'q-c3-pre-3',
        type: 'judge',
        question: 'Java支持多重继承（一个类继承多个类）。',
        correctAnswer: '错误',
        explanation: 'Java类不支持多重继承，一个类只能继承一个父类。但Java可以通过实现多个接口来达到类似效果。',
        commonMisconception: '有人以为Java可以实现多重继承，但Java类只支持单继承。',
        relatedKnowledgePoint: '继承机制',
        hint: 'Java在设计时为了避免菱形继承问题，限制了类的继承方式。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c3-unit',
    courseId: 3,
    type: 'unit-test',
    title: 'Java面向对象程序设计 - 单元测试',
    questions: [
      {
        id: 'q-c3-unit-1',
        type: 'choice',
        question: '以下哪个访问修饰符的访问范围最小？',
        options: ['public', 'protected', 'default(包访问)', 'private'],
        correctAnswer: 3,
        explanation: 'private只能在本类中访问，是访问范围最小的修饰符。访问范围从小到大：private < default < protected < public。',
        relatedKnowledgePoint: '访问控制与封装',
        hint: '哪个修饰符意味着"私有的"？'
      },
      {
        id: 'q-c3-unit-2',
        type: 'choice',
        question: '关于Java接口，以下说法正确的是？',
        options: [
          '接口中可以包含实例变量',
          '接口中的方法默认是public abstract的',
          '一个类只能实现一个接口',
          '接口可以实例化'
        ],
        correctAnswer: 1,
        explanation: 'Java 8之前接口中的方法默认是public abstract的。接口不能包含实例变量（只能有常量），一个类可以实现多个接口，接口不能实例化。',
        relatedKnowledgePoint: '接口与抽象类',
        hint: '接口中的方法有什么默认修饰符？'
      },
      {
        id: 'q-c3-unit-3',
        type: 'code',
        question: '编写一个Java类Student，包含私有字段name和score，提供getter/setter方法，以及一个getGrade()方法：score>=90返回"A"，>=80返回"B"，>=70返回"C"，否则返回"D"。',
        correctAnswer: '封装字段并提供等级判断方法',
        explanation: '考查封装和条件判断的基本应用，使用private字段和public方法实现数据隐藏。',
        relatedKnowledgePoint: '封装与类设计',
        codeTemplate: 'public class Student {\n    private String name;\n    private int score;\n    // 在此编写代码\n}',
        testCases: [
          { input: 'score=95', expected: 'A' },
          { input: 'score=75', expected: 'C' }
        ],
        hint: '先写getter/setter，再写getGrade方法用if-else判断。'
      },
      {
        id: 'q-c3-unit-4',
        type: 'judge',
        question: 'Java中的抽象类可以包含构造方法。',
        correctAnswer: '正确',
        explanation: '抽象类可以有构造方法，虽然不能直接实例化抽象类，但子类可以通过super()调用父类的构造方法。',
        commonMisconception: '有人以为抽象类不能有构造方法，因为不能直接实例化。',
        relatedKnowledgePoint: '抽象类',
        hint: '抽象类的构造方法谁来调用？'
      },
      {
        id: 'q-c3-unit-5',
        type: 'choice',
        question: '以下代码的输出是什么？\nAnimal a = new Dog();\na.sound();\n（Dog继承Animal并重写了sound方法）',
        options: [
          '调用Animal的sound方法',
          '调用Dog的sound方法',
          '编译错误',
          '运行时错误'
        ],
        correctAnswer: 1,
        explanation: '这是多态的体现，编译时看声明类型，运行时看实际类型。a的实际类型是Dog，所以调用Dog重写的sound方法。',
        relatedKnowledgePoint: '多态与动态绑定',
        hint: '运行时看的是实际对象类型还是声明类型？'
      }
    ],
    timeLimitMinutes: 20
  },
  {
    id: 'assess-c4-pre',
    courseId: 4,
    type: 'pre-test',
    title: 'C++面向对象程序设计 - 课前测评',
    questions: [
      {
        id: 'q-c4-pre-1',
        type: 'choice',
        question: 'C++中，哪个关键字用于定义类？',
        options: ['struct', 'class', 'object', 'type'],
        correctAnswer: 1,
        explanation: 'C++使用class关键字定义类。struct也可以定义类，但默认访问权限不同（struct默认public，class默认private）。',
        relatedKnowledgePoint: '类与对象基础',
        hint: '最常用的定义类的关键字是什么？'
      },
      {
        id: 'q-c4-pre-2',
        type: 'choice',
        question: 'C++中，构造函数的特点是？',
        options: [
          '返回类型为void',
          '函数名与类名相同，无返回类型',
          '只能有一个构造函数',
          '必须手动调用'
        ],
        correctAnswer: 1,
        explanation: '构造函数与类同名，没有返回类型（连void也没有），在创建对象时自动调用，可以有多个重载版本。',
        commonMisconception: '有人以为构造函数返回void，但构造函数不能有任何返回类型。',
        relatedKnowledgePoint: '构造与析构',
        hint: '构造函数在什么时候被调用？'
      },
      {
        id: 'q-c4-pre-3',
        type: 'judge',
        question: 'C++支持运算符重载，允许重新定义运算符对自定义类型的操作。',
        correctAnswer: '正确',
        explanation: 'C++支持运算符重载，可以通过operator关键字重新定义运算符对自定义类型的行为，这是C++的重要特性之一。',
        relatedKnowledgePoint: '运算符重载',
        hint: 'C++的一个强大特性是让运算符适用于自定义类型。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c4-unit',
    courseId: 4,
    type: 'unit-test',
    title: 'C++面向对象程序设计 - 单元测试',
    questions: [
      {
        id: 'q-c4-unit-1',
        type: 'choice',
        question: 'C++中虚函数的主要作用是？',
        options: [
          '提高函数执行效率',
          '实现运行时多态',
          '使函数不能被重写',
          '隐藏基类函数'
        ],
        correctAnswer: 1,
        explanation: '虚函数通过动态绑定实现运行时多态，允许通过基类指针调用派生类的函数实现。',
        commonMisconception: '有人以为虚函数是为了效率，实际上虚函数因为有虚表查找反而略有开销。',
        relatedKnowledgePoint: '虚函数与多态',
        hint: '虚函数让基类指针能调用派生类的方法。'
      },
      {
        id: 'q-c4-unit-2',
        type: 'choice',
        question: '关于C++的智能指针，以下说法错误的是？',
        options: [
          'unique_ptr独占所指向的对象',
          'shared_ptr通过引用计数共享所有权',
          'weak_ptr可以独立管理对象生命周期',
          '智能指针可以自动释放内存'
        ],
        correctAnswer: 2,
        explanation: 'weak_ptr不能独立管理对象生命周期，它是对shared_ptr的弱引用，不增加引用计数，必须通过lock()获取shared_ptr才能访问对象。',
        relatedKnowledgePoint: '智能指针与内存管理',
        hint: 'weak_ptr的"弱"体现在哪里？'
      },
      {
        id: 'q-c4-unit-3',
        type: 'code',
        question: '编写一个C++类Rectangle，包含宽(width)和高(height)，实现构造函数、面积计算方法area()和周长计算方法perimeter()。',
        correctAnswer: '实现矩形类的基本功能',
        explanation: '考查类的基本定义、成员变量、构造函数和成员方法的实现。',
        relatedKnowledgePoint: '类设计与实现',
        codeTemplate: 'class Rectangle {\nprivate:\n    double width, height;\npublic:\n    // 在此编写代码\n};',
        testCases: [
          { input: 'width=3, height=4', expected: 'area=12, perimeter=14' },
          { input: 'width=5, height=5', expected: 'area=25, perimeter=20' }
        ],
        hint: '面积=宽×高，周长=2×(宽+高)。'
      },
      {
        id: 'q-c4-unit-4',
        type: 'judge',
        question: 'C++中纯虚函数的类称为抽象类，抽象类可以被实例化。',
        correctAnswer: '错误',
        explanation: '含有纯虚函数的类是抽象类，抽象类不能被实例化，只能作为基类被继承，派生类必须实现纯虚函数才能实例化。',
        commonMisconception: '有人以为抽象类可以创建对象，但C++标准明确禁止。',
        relatedKnowledgePoint: '抽象类与纯虚函数',
        hint: '抽象类就像一个"蓝图"，不能直接建造。'
      }
    ],
    timeLimitMinutes: 18
  },
  {
    id: 'assess-c5-pre',
    courseId: 5,
    type: 'pre-test',
    title: '数据结构 - 课前测评',
    questions: [
      {
        id: 'q-c5-pre-1',
        type: 'choice',
        question: '栈(Stack)的特点是？',
        options: [
          '先进先出(FIFO)',
          '后进先出(LIFO)',
          '随机访问',
          '双端操作'
        ],
        correctAnswer: 1,
        explanation: '栈是后进先出(LIFO, Last In First Out)的数据结构，最后入栈的元素最先出栈。',
        commonMisconception: '初学者常混淆栈和队列的特点，队列才是先进先出。',
        relatedKnowledgePoint: '栈的基本概念',
        hint: '想象一摞盘子，最后放上去的最先被拿走。'
      },
      {
        id: 'q-c5-pre-2',
        type: 'choice',
        question: '以下哪种数据结构适合实现"撤销"操作？',
        options: ['队列', '栈', '链表', '哈希表'],
        correctAnswer: 1,
        explanation: '栈的LIFO特性非常适合实现撤销操作，最近的操作先被撤销。',
        relatedKnowledgePoint: '栈的应用',
        hint: '撤销是撤销最近一次操作，哪种结构能快速获取最近的元素？'
      },
      {
        id: 'q-c5-pre-3',
        type: 'judge',
        question: '二叉搜索树的中序遍历结果一定是有序的。',
        correctAnswer: '正确',
        explanation: '二叉搜索树的性质保证左子树<根<右子树，中序遍历（左-根-右）恰好按从小到大的顺序访问所有节点。',
        relatedKnowledgePoint: '二叉搜索树与遍历',
        hint: '中序遍历的访问顺序是左-根-右。'
      },
      {
        id: 'q-c5-pre-4',
        type: 'choice',
        question: '数组和链表的主要区别是？',
        options: [
          '数组只能存整数，链表可以存任意类型',
          '数组内存连续，链表内存不连续',
          '数组不能排序，链表可以排序',
          '数组长度固定，链表长度不固定'
        ],
        correctAnswer: 1,
        explanation: '数组在内存中占用连续空间，链表的节点通过指针连接，可以分散在内存任意位置。注意：数组长度固定也不是完全准确（动态数组可扩容），内存是否连续才是本质区别。',
        commonMisconception: '很多人选择"数组长度固定"，但这不是最本质的区别。',
        relatedKnowledgePoint: '线性存储结构比较',
        hint: '从内存布局的角度思考。'
      }
    ],
    timeLimitMinutes: 12
  },
  {
    id: 'assess-c5-unit',
    courseId: 5,
    type: 'unit-test',
    title: '数据结构 - 单元测试',
    questions: [
      {
        id: 'q-c5-unit-1',
        type: 'choice',
        question: '在含有n个节点的二叉搜索树中，查找操作的最坏时间复杂度是？',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: '当二叉搜索树退化为链表时（如有序插入），查找的最坏时间复杂度为O(n)。平衡二叉搜索树才能保证O(log n)。',
        commonMisconception: '很多人以为BST查找总是O(log n)，忽略了退化的情况。',
        relatedKnowledgePoint: '二叉搜索树性能分析',
        hint: '如果BST退化为链表会怎样？'
      },
      {
        id: 'q-c5-unit-2',
        type: 'choice',
        question: '哈希表解决冲突的常用方法不包括？',
        options: ['开放定址法', '链地址法', '再哈希法', '递归法'],
        correctAnswer: 3,
        explanation: '哈希冲突的解决方法包括开放定址法、链地址法、再哈希法等。递归法是一种编程技巧，不是解决哈希冲突的方法。',
        relatedKnowledgePoint: '哈希表与冲突处理',
        hint: '哪种方法与哈希表无关？'
      },
      {
        id: 'q-c5-unit-3',
        type: 'code',
        question: '实现一个函数，使用栈来检查一个字符串中的括号是否匹配（包括圆括号、方括号、花括号）。',
        correctAnswer: '利用栈进行括号匹配',
        explanation: '遇到左括号入栈，遇到右括号检查栈顶是否为对应左括号，是则出栈，否则不匹配。最终栈为空则匹配。',
        relatedKnowledgePoint: '栈的应用',
        codeTemplate: 'def is_balanced(s: str) -> bool:\n    # 在此编写代码\n    pass',
        testCases: [
          { input: '"({[]})"', expected: 'True' },
          { input: '"([)]"', expected: 'False' },
          { input: '"((()"', expected: 'False' }
        ],
        hint: '左括号入栈，右括号与栈顶比较。'
      },
      {
        id: 'q-c5-unit-4',
        type: 'choice',
        question: '图的广度优先搜索(BFS)使用的数据结构是？',
        options: ['栈', '队列', '优先队列', '双端队列'],
        correctAnswer: 1,
        explanation: 'BFS使用队列实现，按层次遍历图的节点。DFS使用栈（或递归）实现。',
        commonMisconception: '容易混淆BFS用队列、DFS用栈。',
        relatedKnowledgePoint: '图的遍历',
        hint: 'BFS是逐层扩展，需要先进先出的结构。'
      },
      {
        id: 'q-c5-unit-5',
        type: 'judge',
        question: '完全二叉树一定是满二叉树。',
        correctAnswer: '错误',
        explanation: '完全二叉树不一定是满二叉树。满二叉树要求所有层都填满，完全二叉树只要求最后一层之前的层都填满，最后一层从左到右连续填充。',
        commonMisconception: '很多人混淆完全二叉树和满二叉树的概念。',
        relatedKnowledgePoint: '二叉树的分类',
        hint: '满二叉树是完全二叉树的特例，但反过来不成立。'
      }
    ],
    timeLimitMinutes: 20
  },
  {
    id: 'assess-c6-pre',
    courseId: 6,
    type: 'pre-test',
    title: '算法设计与分析 - 课前测评',
    questions: [
      {
        id: 'q-c6-pre-1',
        type: 'choice',
        question: '算法的时间复杂度是用来衡量什么的？',
        options: [
          '算法代码的长度',
          '算法执行所需时间随输入规模增长的趋势',
          '算法占用的内存大小',
          '算法的正确性'
        ],
        correctAnswer: 1,
        explanation: '时间复杂度描述的是算法执行时间随输入规模增长的变化趋势，用大O表示法表示。',
        commonMisconception: '有人以为时间复杂度是具体的执行时间，实际上它描述的是增长趋势。',
        relatedKnowledgePoint: '算法复杂度基础',
        hint: '大O表示法关注的是什么？'
      },
      {
        id: 'q-c6-pre-2',
        type: 'choice',
        question: '分治法的基本思想是？',
        options: [
          '逐步构建解',
          '将问题分解为子问题，分别求解后合并',
          '贪心选择局部最优',
          '通过剪枝减少搜索空间'
        ],
        correctAnswer: 1,
        explanation: '分治法的核心是将大问题分解为结构相同的子问题，递归求解子问题，最后合并子问题的解。',
        relatedKnowledgePoint: '分治策略',
        hint: '分治=分解+求解+合并。'
      },
      {
        id: 'q-c6-pre-3',
        type: 'judge',
        question: 'O(n²)的算法一定比O(n log n)的算法慢。',
        correctAnswer: '错误',
        explanation: '大O表示法描述的是渐近复杂度，当n足够大时O(n²)才一定比O(n log n)慢。对于小的n值，由于常数因子的影响，O(n²)的算法可能更快。',
        commonMisconception: '很多人忽略常数因子和输入规模的影响。',
        relatedKnowledgePoint: '复杂度分析',
        hint: '大O表示法忽略常数因子，实际性能还取决于具体实现和输入规模。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c6-unit',
    courseId: 6,
    type: 'unit-test',
    title: '算法设计与分析 - 单元测试',
    questions: [
      {
        id: 'q-c6-unit-1',
        type: 'choice',
        question: '归并排序的时间复杂度和空间复杂度分别是？',
        options: [
          'O(n log n) 和 O(1)',
          'O(n log n) 和 O(n)',
          'O(n²) 和 O(n)',
          'O(n) 和 O(n)'
        ],
        correctAnswer: 1,
        explanation: '归并排序的时间复杂度为O(n log n)，但需要O(n)的额外空间来合并子数组，因此不是原地排序。',
        commonMisconception: '有人以为归并排序是原地排序，空间复杂度为O(1)。',
        relatedKnowledgePoint: '排序算法比较',
        hint: '归并排序合并时需要额外的临时数组。'
      },
      {
        id: 'q-c6-unit-2',
        type: 'choice',
        question: '动态规划与分治法的主要区别是？',
        options: [
          '动态规划只能解决最优化问题',
          '动态规划的子问题有重叠，分治法的子问题相互独立',
          '分治法比动态规划效率高',
          '动态规划不需要递归'
        ],
        correctAnswer: 1,
        explanation: '动态规划适用于子问题重叠的情况，通过存储已解决的子问题结果避免重复计算。分治法的子问题相互独立，不需要记忆化。',
        commonMisconception: '有人以为动态规划不能递归，实际上带备忘录的递归也是动态规划。',
        relatedKnowledgePoint: '动态规划原理',
        hint: '子问题之间有没有重叠是关键区别。'
      },
      {
        id: 'q-c6-unit-3',
        type: 'code',
        question: '使用动态规划实现0-1背包问题：给定物品重量数组w、价值数组v和背包容量W，求最大价值。',
        correctAnswer: '使用DP表求解0-1背包',
        explanation: '定义dp[i][j]为前i个物品、容量为j时的最大价值，状态转移：dp[i][j]=max(dp[i-1][j], dp[i-1][j-w[i]]+v[i])。',
        relatedKnowledgePoint: '动态规划经典问题',
        codeTemplate: 'def knapsack(w, v, W):\n    # 在此编写代码\n    pass',
        testCases: [
          { input: 'w=[2,3,4], v=[3,4,5], W=5', expected: '7' },
          { input: 'w=[1,2,3], v=[6,10,12], W=5', expected: '22' }
        ],
        hint: '定义dp[i][j]为前i个物品容量j的最大价值，考虑选或不选第i个物品。'
      },
      {
        id: 'q-c6-unit-4',
        type: 'choice',
        question: '以下哪种算法策略适合解决最短路径问题？',
        options: ['分治法', '贪心算法', '回溯法', '分支限界法'],
        correctAnswer: 1,
        explanation: 'Dijkstra算法使用贪心策略解决单源最短路径问题，每次选择当前最短的路径进行扩展。',
        relatedKnowledgePoint: '贪心算法应用',
        hint: 'Dijkstra算法每次选择什么？'
      }
    ],
    timeLimitMinutes: 18
  },
  {
    id: 'assess-c7-pre',
    courseId: 7,
    type: 'pre-test',
    title: '编译原理 - 课前测评',
    questions: [
      {
        id: 'q-c7-pre-1',
        type: 'choice',
        question: '编译器的主要工作阶段不包括？',
        options: ['词法分析', '语法分析', '代码执行', '代码生成'],
        correctAnswer: 2,
        explanation: '编译器的工作阶段包括词法分析、语法分析、语义分析、中间代码生成、代码优化和目标代码生成。代码执行是运行时的任务，不是编译器的职责。',
        relatedKnowledgePoint: '编译器基本结构',
        hint: '编译器生成代码，但不执行代码。'
      },
      {
        id: 'q-c7-pre-2',
        type: 'choice',
        question: '词法分析器的输入和输出分别是？',
        options: [
          '源程序和语法树',
          '字符流和记号流(Token流)',
          '记号流和语法树',
          '源程序和目标代码'
        ],
        correctAnswer: 1,
        explanation: '词法分析器读取源程序的字符流，将其组织成有意义的记号(Token)序列，供语法分析器使用。',
        relatedKnowledgePoint: '词法分析',
        hint: '词法分析是编译的第一阶段，处理最基本的单位。'
      },
      {
        id: 'q-c7-pre-3',
        type: 'judge',
        question: '解释器也会生成目标代码文件。',
        correctAnswer: '错误',
        explanation: '解释器逐行读取并执行源代码，不会生成独立的目标代码文件。编译器才会生成目标代码文件。',
        commonMisconception: '有人混淆编译器和解释器的工作方式。',
        relatedKnowledgePoint: '编译与解释',
        hint: '解释器是"边读边执行"。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c7-unit',
    courseId: 7,
    type: 'unit-test',
    title: '编译原理 - 单元测试',
    questions: [
      {
        id: 'q-c7-unit-1',
        type: 'choice',
        question: '以下文法产生的语言是什么？\nS → aSb | ε',
        options: [
          '所有a和b组成的字符串',
          '所有a和b数量相等的字符串',
          '所有形如aⁿbⁿ的字符串(n≥0)',
          '所有回文字符串'
        ],
        correctAnswer: 2,
        explanation: '该文法每次递归在S两端添加一个a和一个b，基础情况为空串，所以生成的是aⁿbⁿ形式的字符串。',
        relatedKnowledgePoint: '上下文无关文法',
        hint: '每次递归同时添加一个a和一个b。'
      },
      {
        id: 'q-c7-unit-2',
        type: 'choice',
        question: '在LR分析中，"移进-归约冲突"是指？',
        options: [
          '无法确定下一步是移进还是归约',
          '有两个不同的归约规则可用',
          '输入符号无法匹配任何规则',
          '栈溢出'
        ],
        correctAnswer: 0,
        explanation: '移进-归约冲突是指分析器在某个状态下，既可以选择将下一个输入符号移进栈中，也可以选择将栈顶的符号串归约为某个非终结符，两种操作都合法。',
        commonMisconception: '有人混淆移进-归约冲突和归约-归约冲突。',
        relatedKnowledgePoint: '自底向上语法分析',
        hint: '冲突是在"移进"和"归约"两种动作之间。'
      },
      {
        id: 'q-c7-unit-3',
        type: 'choice',
        question: '中间代码的优势不包括？',
        options: [
          '便于进行机器无关的优化',
          '便于移植到不同目标机器',
          '直接提高执行速度',
          '使编译器结构更清晰'
        ],
        correctAnswer: 2,
        explanation: '中间代码本身不直接提高执行速度，它是一种内部表示形式，方便优化和移植。执行速度取决于最终生成的目标代码质量。',
        relatedKnowledgePoint: '中间代码生成',
        hint: '中间代码是编译器内部的表示，不是最终产物。'
      },
      {
        id: 'q-c7-unit-4',
        type: 'judge',
        question: '正则表达式可以描述所有上下文无关文法能描述的语言。',
        correctAnswer: '错误',
        explanation: '正则表达式等价于有限自动机，只能描述正则语言。上下文无关文法比正则表达式更强大，例如正则表达式无法描述aⁿbⁿ这类语言。',
        commonMisconception: '有人以为正则表达式很强大可以描述任何语言。',
        relatedKnowledgePoint: '形式语言与自动机',
        hint: '正则表达式的表达能力有限，无法处理嵌套结构。'
      }
    ],
    timeLimitMinutes: 18
  },
  {
    id: 'assess-c8-pre',
    courseId: 8,
    type: 'pre-test',
    title: '计算机组成原理 - 课前测评',
    questions: [
      {
        id: 'q-c8-pre-1',
        type: 'choice',
        question: '计算机的五大基本组成部分不包括？',
        options: ['运算器', '控制器', '编译器', '存储器'],
        correctAnswer: 2,
        explanation: '冯·诺依曼体系结构的五大部件是：运算器、控制器、存储器、输入设备和输出设备。编译器是软件，不是硬件部件。',
        relatedKnowledgePoint: '冯·诺依曼体系结构',
        hint: '编译器是软件还是硬件？'
      },
      {
        id: 'q-c8-pre-2',
        type: 'choice',
        question: '1个字节(Byte)等于多少位(bit)？',
        options: ['4位', '8位', '16位', '32位'],
        correctAnswer: 1,
        explanation: '1字节=8位，这是计算机中最基本的存储单位换算关系。',
        relatedKnowledgePoint: '数据表示与存储',
        hint: 'Byte和bit的关系是8:1。'
      },
      {
        id: 'q-c8-pre-3',
        type: 'judge',
        question: 'RAM中的数据在断电后会丢失。',
        correctAnswer: '正确',
        explanation: 'RAM（随机存取存储器）是易失性存储器，断电后数据会丢失。ROM是非易失性存储器，断电后数据不会丢失。',
        commonMisconception: '有人混淆RAM和ROM的断电特性。',
        relatedKnowledgePoint: '存储器分类',
        hint: 'RAM是易失性还是非易失性存储器？'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c8-unit',
    courseId: 8,
    type: 'unit-test',
    title: '计算机组成原理 - 单元测试',
    questions: [
      {
        id: 'q-c8-unit-1',
        type: 'choice',
        question: '在补码表示中，8位有符号整数的表示范围是？',
        options: [
          '-127到127',
          '-128到127',
          '-128到128',
          '-127到128'
        ],
        correctAnswer: 1,
        explanation: '8位补码的表示范围是-128到127。n位补码的范围是-2^(n-1)到2^(n-1)-1。负数比正数多一个是因为0占用了一个正数编码。',
        commonMisconception: '很多人以为范围是对称的，但补码表示中负数比正数多一个。',
        relatedKnowledgePoint: '数值的补码表示',
        hint: '补码表示中0只有一个编码，所以负数多一个。'
      },
      {
        id: 'q-c8-unit-2',
        type: 'choice',
        question: 'Cache加速程序执行的原理是？',
        options: [
          '增大内存容量',
          '利用程序的局部性原理',
          '提高CPU主频',
          '减少指令数量'
        ],
        correctAnswer: 1,
        explanation: 'Cache利用程序的局部性原理（时间局部性和空间局部性），将频繁访问的数据存储在高速缓存中，减少CPU访问主存的次数。',
        relatedKnowledgePoint: 'Cache存储器',
        hint: 'Cache为什么能"猜到"CPU需要什么数据？'
      },
      {
        id: 'q-c8-unit-3',
        type: 'choice',
        question: 'CPU中的PC(程序计数器)的作用是？',
        options: [
          '存储当前正在执行的指令',
          '存储下一条要执行的指令地址',
          '存储运算结果',
          '存储内存地址'
        ],
        correctAnswer: 1,
        explanation: 'PC（Program Counter）存储下一条要执行的指令地址，CPU每次取指令后PC自动递增，分支指令会修改PC的值。',
        commonMisconception: '有人以为PC存储的是当前指令，实际上存储的是下一条指令的地址。',
        relatedKnowledgePoint: 'CPU基本结构',
        hint: 'PC让CPU知道下一步该去哪里取指令。'
      },
      {
        id: 'q-c8-unit-4',
        type: 'judge',
        question: '指令流水线中，数据冒险(Data Hazard)是指两条指令同时需要使用ALU。',
        correctAnswer: '错误',
        explanation: '数据冒险是指后续指令需要使用前面指令的结果，但前面指令尚未写回，导致数据依赖冲突。资源冲突（结构冒险）才是多条指令争用同一硬件资源。',
        commonMisconception: '容易混淆数据冒险和结构冒险。',
        relatedKnowledgePoint: '指令流水线',
        hint: '数据冒险关注的是数据依赖关系，不是资源竞争。'
      }
    ],
    timeLimitMinutes: 18
  },
  {
    id: 'assess-c9-pre',
    courseId: 9,
    type: 'pre-test',
    title: '操作系统 - 课前测评',
    questions: [
      {
        id: 'q-c9-pre-1',
        type: 'choice',
        question: '操作系统的核心功能不包括？',
        options: ['进程管理', '内存管理', '编写应用程序', '文件管理'],
        correctAnswer: 2,
        explanation: '操作系统的核心功能包括进程管理、内存管理、文件管理、设备管理等。编写应用程序是程序员的工作，不是操作系统的功能。',
        relatedKnowledgePoint: '操作系统概述',
        hint: '操作系统管理硬件资源，编写应用不是它的职责。'
      },
      {
        id: 'q-c9-pre-2',
        type: 'choice',
        question: '进程和线程的主要区别是？',
        options: [
          '线程不能并发执行',
          '进程是资源分配的基本单位，线程是CPU调度的基本单位',
          '线程拥有独立的地址空间',
          '进程共享线程的内存'
        ],
        correctAnswer: 1,
        explanation: '进程是资源分配的基本单位，拥有独立的地址空间；线程是CPU调度的基本单位，同一进程的线程共享进程的地址空间和资源。',
        commonMisconception: '有人以为线程也有独立地址空间，但线程共享所属进程的地址空间。',
        relatedKnowledgePoint: '进程与线程',
        hint: '哪个是资源分配单位，哪个是调度单位？'
      },
      {
        id: 'q-c9-pre-3',
        type: 'judge',
        question: '死锁是指两个或多个进程无限期地等待对方占有的资源。',
        correctAnswer: '正确',
        explanation: '死锁的定义就是一组进程中每个进程都在等待只能由该组中的其他进程释放的资源，导致所有进程都无法继续执行。',
        relatedKnowledgePoint: '死锁概念',
        hint: '死锁的核心是"循环等待"。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c9-unit',
    courseId: 9,
    type: 'unit-test',
    title: '操作系统 - 单元测试',
    questions: [
      {
        id: 'q-c9-unit-1',
        type: 'choice',
        question: '以下哪种页面置换算法可能出现Belady异常？',
        options: ['LRU', 'OPT', 'FIFO', 'Clock'],
        correctAnswer: 2,
        explanation: 'FIFO页面置换算法可能出现Belady异常，即分配的物理页框数增加时，缺页率反而上升。LRU和OPT属于栈式算法，不会出现Belady异常。',
        commonMisconception: '有人以为所有算法都可能出现Belady异常，但只有非栈式算法才会。',
        relatedKnowledgePoint: '虚拟内存与页面置换',
        hint: 'Belady异常与栈式性质有关。'
      },
      {
        id: 'q-c9-unit-2',
        type: 'choice',
        question: '产生死锁的四个必要条件中，不包括？',
        options: ['互斥条件', '请求与保持条件', '抢占条件', '循环等待条件'],
        correctAnswer: 2,
        explanation: '死锁的四个必要条件是：互斥条件、请求与保持条件、不可抢占条件、循环等待条件。"抢占条件"与"不可抢占条件"相反，不是死锁的必要条件。',
        commonMisconception: '有人把"不可抢占"记成"可抢占"，注意是不可抢占。',
        relatedKnowledgePoint: '死锁的必要条件',
        hint: '四个条件中有一个是"不可"开头的。'
      },
      {
        id: 'q-c9-unit-3',
        type: 'choice',
        question: '进程的三种基本状态不包括？',
        options: ['就绪态', '运行态', '阻塞态', '挂起态'],
        correctAnswer: 3,
        explanation: '进程的三种基本状态是就绪态、运行态和阻塞态。挂起态是引入中间存储后的扩展状态，不是三种基本状态之一。',
        commonMisconception: '有人把挂起态当作基本状态。',
        relatedKnowledgePoint: '进程状态与转换',
        hint: '三种基本状态对应"准备好运行"、"正在运行"和"等待资源"。'
      },
      {
        id: 'q-c9-unit-4',
        type: 'judge',
        question: '信号量的P操作可能导致进程阻塞。',
        correctAnswer: '正确',
        explanation: 'P操作（wait操作）将信号量减1，如果结果小于0，则将当前进程加入等待队列并阻塞。所以P操作确实可能导致进程阻塞。',
        relatedKnowledgePoint: '进程同步与信号量',
        hint: 'P操作在什么情况下会让进程等待？'
      },
      {
        id: 'q-c9-unit-5',
        type: 'choice',
        question: '以下哪种磁盘调度算法可能存在"饥饿"问题？',
        options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN'],
        correctAnswer: 1,
        explanation: 'SSTF（最短寻道时间优先）总是选择距离当前磁头最近的请求，可能导致远处的请求长期得不到服务，产生饥饿现象。',
        commonMisconception: '有人以为SCAN也会饥饿，但SCAN是双向扫描，所有请求都会被处理。',
        relatedKnowledgePoint: '磁盘调度',
        hint: '哪种算法总是优先处理近的请求而忽略远的？'
      }
    ],
    timeLimitMinutes: 20
  },
  {
    id: 'assess-c10-pre',
    courseId: 10,
    type: 'pre-test',
    title: '计算机网络 - 课前测评',
    questions: [
      {
        id: 'q-c10-pre-1',
        type: 'choice',
        question: 'OSI参考模型共有几层？',
        options: ['4层', '5层', '7层', '6层'],
        correctAnswer: 2,
        explanation: 'OSI参考模型共7层：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层。',
        relatedKnowledgePoint: '网络体系结构',
        hint: 'OSI模型从下到上共7层。'
      },
      {
        id: 'q-c10-pre-2',
        type: 'choice',
        question: 'TCP和UDP的主要区别是？',
        options: [
          'TCP速度快，UDP速度慢',
          'TCP面向连接，UDP无连接',
          'TCP只能传文本，UDP只能传视频',
          'TCP和UDP没有区别'
        ],
        correctAnswer: 1,
        explanation: 'TCP是面向连接的可靠传输协议，UDP是无连接的不可靠传输协议。TCP保证数据可靠到达，UDP不保证但延迟更低。',
        commonMisconception: '有人以为TCP比UDP快，实际上UDP因为没有连接和确认机制，通常更快。',
        relatedKnowledgePoint: '传输层协议',
        hint: 'TCP需要三次握手建立连接，UDP不需要。'
      },
      {
        id: 'q-c10-pre-3',
        type: 'judge',
        question: 'IP地址192.168.1.1属于C类地址。',
        correctAnswer: '正确',
        explanation: 'C类地址的范围是192.0.0.0到223.255.255.255，192.168.1.1以192开头，属于C类私有地址。',
        relatedKnowledgePoint: 'IP地址分类',
        hint: 'C类地址以192-223开头。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c10-unit',
    courseId: 10,
    type: 'unit-test',
    title: '计算机网络 - 单元测试',
    questions: [
      {
        id: 'q-c10-unit-1',
        type: 'choice',
        question: 'TCP三次握手的正确顺序是？',
        options: [
          'SYN → ACK → SYN+ACK',
          'SYN → SYN+ACK → ACK',
          'ACK → SYN → SYN+ACK',
          'SYN+ACK → SYN → ACK'
        ],
        correctAnswer: 1,
        explanation: 'TCP三次握手：客户端发送SYN，服务器回复SYN+ACK，客户端发送ACK。三次握手确保双方都能收发数据。',
        commonMisconception: '有人记错SYN和ACK的顺序。',
        relatedKnowledgePoint: 'TCP连接管理',
        hint: '客户端先发起，服务器响应，客户端确认。'
      },
      {
        id: 'q-c10-unit-2',
        type: 'choice',
        question: 'HTTP状态码404表示？',
        options: [
          '服务器内部错误',
          '请求的资源未找到',
          '请求成功',
          '重定向'
        ],
        correctAnswer: 1,
        explanation: '404 Not Found表示服务器找不到请求的资源。200表示成功，301/302表示重定向，500表示服务器内部错误。',
        relatedKnowledgePoint: '应用层协议',
        hint: '404是最常见的错误页面状态码。'
      },
      {
        id: 'q-c10-unit-3',
        type: 'choice',
        question: 'ARP协议的作用是？',
        options: [
          '将域名解析为IP地址',
          '将IP地址解析为MAC地址',
          '将MAC地址解析为IP地址',
          '分配IP地址'
        ],
        correctAnswer: 1,
        explanation: 'ARP（Address Resolution Protocol）将IP地址解析为MAC地址。DNS将域名解析为IP地址，DHCP用于分配IP地址。',
        commonMisconception: '有人混淆ARP和DNS的功能。',
        relatedKnowledgePoint: '网络层协议',
        hint: 'ARP是IP到MAC的桥梁。'
      },
      {
        id: 'q-c10-unit-4',
        type: 'judge',
        question: 'HTTPS比HTTP更安全，因为它对传输的数据进行了加密。',
        correctAnswer: '正确',
        explanation: 'HTTPS在HTTP基础上加入了SSL/TLS加密层，对传输的数据进行加密，防止数据在传输过程中被窃听或篡改。',
        relatedKnowledgePoint: '网络安全基础',
        hint: 'HTTPS = HTTP + SSL/TLS。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c11-pre',
    courseId: 11,
    type: 'pre-test',
    title: '数据库系统原理 - 课前测评',
    questions: [
      {
        id: 'q-c11-pre-1',
        type: 'choice',
        question: '关系数据库中，一行数据称为？',
        options: ['字段', '元组', '属性', '域'],
        correctAnswer: 1,
        explanation: '在关系数据库中，一行称为元组(Tuple)，一列称为属性(Attribute)，列的取值范围称为域(Domain)。',
        commonMisconception: '初学者常混淆元组和属性的概念。',
        relatedKnowledgePoint: '关系模型基本概念',
        hint: '行是元组，列是属性。'
      },
      {
        id: 'q-c11-pre-2',
        type: 'choice',
        question: 'SQL中用于查询数据的关键字是？',
        options: ['GET', 'FETCH', 'SELECT', 'QUERY'],
        correctAnswer: 2,
        explanation: 'SQL使用SELECT语句查询数据，这是SQL中最常用的语句。',
        relatedKnowledgePoint: 'SQL基础',
        hint: 'SQL查询语句以哪个关键字开头？'
      },
      {
        id: 'q-c11-pre-3',
        type: 'judge',
        question: '主键可以包含NULL值。',
        correctAnswer: '错误',
        explanation: '主键(Primary Key)必须满足唯一性和非空性两个约束，不允许包含NULL值。',
        commonMisconception: '有人以为主键只要求唯一，但主键同时要求非空。',
        relatedKnowledgePoint: '完整性约束',
        hint: '主键的两个基本约束是什么？'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c11-unit',
    courseId: 11,
    type: 'unit-test',
    title: '数据库系统原理 - 单元测试',
    questions: [
      {
        id: 'q-c11-unit-1',
        type: 'choice',
        question: '数据库的ACID特性中，I代表？',
        options: ['完整性(Integrity)', '隔离性(Isolation)', '独立性(Independence)', '一致性(Identity)'],
        correctAnswer: 1,
        explanation: 'ACID分别代表原子性(Atomicity)、一致性(Consistency)、隔离性(Isolation)、持久性(Durability)。I是隔离性。',
        commonMisconception: '有人把I记成完整性或独立性。',
        relatedKnowledgePoint: '事务与ACID',
        hint: 'ACID中的I是Isolation。'
      },
      {
        id: 'q-c11-unit-2',
        type: 'choice',
        question: '以下哪种范式要求消除传递依赖？',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: 2,
        explanation: '3NF（第三范式）要求消除非主属性对候选键的传递依赖。2NF消除部分依赖，BCNF是3NF的加强版。',
        commonMisconception: '有人混淆2NF和3NF消除的依赖类型。',
        relatedKnowledgePoint: '数据库范式',
        hint: '1NF消除重复组，2NF消除部分依赖，3NF消除传递依赖。'
      },
      {
        id: 'q-c11-unit-3',
        type: 'code',
        question: '编写SQL查询：从学生表students中查询年龄大于20且成绩(score)大于80的学生姓名和成绩，按成绩降序排列。',
        correctAnswer: 'SELECT name, score FROM students WHERE age > 20 AND score > 80 ORDER BY score DESC',
        explanation: '使用WHERE进行条件筛选，AND连接多个条件，ORDER BY排序，DESC降序。',
        relatedKnowledgePoint: 'SQL查询语句',
        codeTemplate: '-- 在此编写SQL查询语句',
        testCases: [
          { input: 'students表含符合条件的数据', expected: '返回年龄>20且score>80的记录，按score降序' }
        ],
        hint: 'SELECT...FROM...WHERE...ORDER BY...结构。'
      },
      {
        id: 'q-c11-unit-4',
        type: 'judge',
        question: '视图(View)中存储了实际的数据。',
        correctAnswer: '错误',
        explanation: '视图是虚拟表，不存储实际数据，只存储查询定义。查询视图时，DBMS会执行视图定义中的查询语句来获取数据。',
        commonMisconception: '有人以为视图像表一样存储数据副本。',
        relatedKnowledgePoint: '视图',
        hint: '视图是"窗口"不是"仓库"。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c12-pre',
    courseId: 12,
    type: 'pre-test',
    title: '软件工程 - 课前测评',
    questions: [
      {
        id: 'q-c12-pre-1',
        type: 'choice',
        question: '软件生命周期不包括以下哪个阶段？',
        options: ['需求分析', '系统设计', '硬件维修', '软件测试'],
        correctAnswer: 2,
        explanation: '软件生命周期包括需求分析、系统设计、编码实现、软件测试、部署维护等阶段。硬件维修不属于软件生命周期。',
        relatedKnowledgePoint: '软件生命周期',
        hint: '软件生命周期关注的是软件，不是硬件。'
      },
      {
        id: 'q-c12-pre-2',
        type: 'choice',
        question: '敏捷开发的核心价值观强调？',
        options: [
          '详尽的文档',
          '遵循计划',
          '个体和互动高于流程和工具',
          '合同谈判'
        ],
        correctAnswer: 2,
        explanation: '敏捷宣言的四个核心价值观之一：个体和互动高于流程和工具。其他三个是：可工作的软件高于详尽的文档、客户合作高于合同谈判、响应变化高于遵循计划。',
        relatedKnowledgePoint: '敏捷开发方法',
        hint: '敏捷强调人和交流，而非工具和流程。'
      },
      {
        id: 'q-c12-pre-3',
        type: 'judge',
        question: '瀑布模型要求每个阶段必须完成后才能进入下一个阶段。',
        correctAnswer: '正确',
        explanation: '瀑布模型是线性顺序模型，要求需求分析→设计→编码→测试→维护严格按顺序进行，前一阶段完成才能进入下一阶段。',
        relatedKnowledgePoint: '软件开发模型',
        hint: '瀑布是"水往低处流"，不可逆。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c12-unit',
    courseId: 12,
    type: 'unit-test',
    title: '软件工程 - 单元测试',
    questions: [
      {
        id: 'q-c12-unit-1',
        type: 'choice',
        question: 'UML中，用于描述系统功能需求的图是？',
        options: ['类图', '用例图', '时序图', '部署图'],
        correctAnswer: 1,
        explanation: '用例图(Use Case Diagram)描述系统的功能和参与者，是需求分析阶段最常用的UML图。类图描述静态结构，时序图描述交互过程，部署图描述物理部署。',
        relatedKnowledgePoint: 'UML建模',
        hint: '哪种图从用户角度描述系统功能？'
      },
      {
        id: 'q-c12-unit-2',
        type: 'choice',
        question: '以下哪种耦合类型耦合度最低？',
        options: ['内容耦合', '公共耦合', '数据耦合', '非直接耦合'],
        correctAnswer: 3,
        explanation: '耦合度从低到高：非直接耦合 < 数据耦合 < 标记耦合 < 控制耦合 < 公共耦合 < 内容耦合。非直接耦合是最低的。',
        commonMisconception: '有人以为数据耦合最低，但非直接耦合更低。',
        relatedKnowledgePoint: '软件设计原则',
        hint: '模块之间没有任何直接联系时耦合最低。'
      },
      {
        id: 'q-c12-unit-3',
        type: 'choice',
        question: '软件测试中，白盒测试关注的是？',
        options: [
          '软件的功能是否符合需求',
          '程序内部逻辑结构和执行路径',
          '用户界面是否美观',
          '软件的性能指标'
        ],
        correctAnswer: 1,
        explanation: '白盒测试基于程序内部逻辑结构设计测试用例，关注代码的执行路径和覆盖情况。黑盒测试关注功能和需求。',
        commonMisconception: '有人混淆白盒和黑盒测试的关注点。',
        relatedKnowledgePoint: '软件测试方法',
        hint: '白盒=能看到内部代码，黑盒=只看外部功能。'
      },
      {
        id: 'q-c12-unit-4',
        type: 'judge',
        question: '代码审查(Code Review)只能在代码编写完成后进行一次。',
        correctAnswer: '错误',
        explanation: '代码审查可以在开发过程中多次进行，现代实践中通常在每次代码提交(Pull Request)时进行审查，是持续质量保证的重要手段。',
        relatedKnowledgePoint: '代码质量保证',
        hint: '现代开发中代码审查是持续进行的。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c13-pre',
    courseId: 13,
    type: 'pre-test',
    title: '软件测试 - 课前测评',
    questions: [
      {
        id: 'q-c13-pre-1',
        type: 'choice',
        question: '软件测试的目的是？',
        options: [
          '证明软件没有缺陷',
          '发现软件中的缺陷',
          '修改软件中的缺陷',
          '设计软件功能'
        ],
        correctAnswer: 1,
        explanation: '软件测试的目的是发现缺陷，而不是证明没有缺陷。修改缺陷是调试的工作，设计功能是开发的工作。',
        commonMisconception: '很多人以为测试是为了证明软件没有bug，但测试只能发现bug，不能证明没有bug。',
        relatedKnowledgePoint: '软件测试基础',
        hint: '测试是"找bug"不是"证明没bug"。'
      },
      {
        id: 'q-c13-pre-2',
        type: 'choice',
        question: '以下哪个是黑盒测试方法？',
        options: ['语句覆盖', '等价类划分', '路径覆盖', '条件覆盖'],
        correctAnswer: 1,
        explanation: '等价类划分是黑盒测试方法，不关注内部代码结构。语句覆盖、路径覆盖、条件覆盖都是白盒测试方法。',
        relatedKnowledgePoint: '黑盒测试方法',
        hint: '哪种方法不需要了解代码内部结构？'
      },
      {
        id: 'q-c13-pre-3',
        type: 'judge',
        question: '单元测试通常由开发人员自己完成。',
        correctAnswer: '正确',
        explanation: '单元测试通常由开发人员编写和执行，因为开发人员最了解代码的内部结构和逻辑。集成测试和系统测试则通常由测试人员负责。',
        relatedKnowledgePoint: '测试级别',
        hint: '谁最了解代码单元的细节？'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c13-unit',
    courseId: 13,
    type: 'unit-test',
    title: '软件测试 - 单元测试',
    questions: [
      {
        id: 'q-c13-unit-1',
        type: 'choice',
        question: '边界值分析法的核心思想是？',
        options: [
          '测试所有可能的输入值',
          '在等价类边界附近选择测试用例',
          '只测试正常输入',
          '随机选择测试数据'
        ],
        correctAnswer: 1,
        explanation: '边界值分析认为错误往往发生在输入范围的边界上，因此在等价类边界附近选取测试数据更容易发现缺陷。',
        relatedKnowledgePoint: '黑盒测试技术',
        hint: 'bug喜欢藏在边界上。'
      },
      {
        id: 'q-c13-unit-2',
        type: 'choice',
        question: '以下哪种测试属于非功能测试？',
        options: ['单元测试', '集成测试', '性能测试', '回归测试'],
        correctAnswer: 2,
        explanation: '性能测试是非功能测试，关注系统的响应时间、吞吐量等性能指标。单元测试、集成测试、回归测试都属于功能测试范畴。',
        relatedKnowledgePoint: '非功能测试',
        hint: '哪种测试关注的是"多快"而不是"对不对"？'
      },
      {
        id: 'q-c13-unit-3',
        type: 'choice',
        question: '回归测试的目的是？',
        options: [
          '测试新功能',
          '验证修改后的代码没有引入新的缺陷',
          '测试系统的极限性能',
          '验证用户需求'
        ],
        correctAnswer: 1,
        explanation: '回归测试是在代码修改后重新运行之前的测试用例，确保修改没有引入新的缺陷或导致原有功能失效。',
        relatedKnowledgePoint: '回归测试',
        hint: '回归=回到原来的状态，确保没变坏。'
      },
      {
        id: 'q-c13-unit-4',
        type: 'judge',
        question: '代码覆盖率达到100%就意味着程序没有缺陷。',
        correctAnswer: '错误',
        explanation: '100%代码覆盖率只说明每行代码都被执行过，但不代表所有可能的输入组合和执行路径都被测试过，也不能保证逻辑的正确性。',
        commonMisconception: '很多人以为高覆盖率等于高质量，但覆盖率只是测试完整性的一个指标。',
        relatedKnowledgePoint: '测试覆盖率',
        hint: '覆盖率衡量的是"执行了多少代码"，不是"测试了多少情况"。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c14-pre',
    courseId: 14,
    type: 'pre-test',
    title: '离散数学 - 课前测评',
    questions: [
      {
        id: 'q-c14-pre-1',
        type: 'choice',
        question: '集合A={1,2,3}的幂集包含多少个元素？',
        options: ['6', '8', '3', '9'],
        correctAnswer: 1,
        explanation: '集合A有3个元素，其幂集（所有子集的集合）有2³=8个元素，包括空集和自身。',
        relatedKnowledgePoint: '集合论基础',
        hint: 'n个元素的集合的幂集有2ⁿ个元素。'
      },
      {
        id: 'q-c14-pre-2',
        type: 'choice',
        question: '命题"如果2+2=5，那么太阳从西边升起"的真值是？',
        options: ['真', '假', '无法确定', '取决于实际情况'],
        correctAnswer: 0,
        explanation: '在逻辑中，条件命题p→q，当p为假时，无论q真假，整个命题为真。这是"空真"(vacuous truth)。2+2=5为假，所以命题为真。',
        commonMisconception: '很多人觉得前提为假时命题无意义，但在形式逻辑中前提为假则蕴含式为真。',
        relatedKnowledgePoint: '命题逻辑',
        hint: '前提为假时，条件命题的真值是什么？'
      },
      {
        id: 'q-c14-pre-3',
        type: 'judge',
        question: '所有关系都是函数。',
        correctAnswer: '错误',
        explanation: '函数是一种特殊的关系，要求每个输入对应唯一的输出。一般关系不要求唯一性，一个输入可以对应多个输出。',
        commonMisconception: '有人以为关系和函数是等价的。',
        relatedKnowledgePoint: '关系与函数',
        hint: '函数比关系多了什么约束？'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c14-unit',
    courseId: 14,
    type: 'unit-test',
    title: '离散数学 - 单元测试',
    questions: [
      {
        id: 'q-c14-unit-1',
        type: 'choice',
        question: '在图论中，欧拉回路存在的充要条件是？',
        options: [
          '图是连通的且所有顶点度数都相同',
          '图是连通的且所有顶点度数都是偶数',
          '图是完全图',
          '图没有奇数度顶点'
        ],
        correctAnswer: 1,
        explanation: '欧拉回路存在的充要条件是图是连通的且所有顶点的度数都是偶数。注意仅"没有奇数度顶点"不够，还需要连通。',
        commonMisconception: '有人忘记连通性条件。',
        relatedKnowledgePoint: '图论基础',
        hint: '两个条件缺一不可：连通+偶数度。'
      },
      {
        id: 'q-c14-unit-2',
        type: 'choice',
        question: 'P(n)=n!的渐进增长率与以下哪个相同？',
        options: ['O(2ⁿ)', 'O(nⁿ)', 'O(nⁿ/²)', '由斯特林公式，n!≈√(2πn)(n/e)ⁿ'],
        correctAnswer: 3,
        explanation: '根据斯特林公式，n!的渐近增长率为Θ(√(2πn)(n/e)ⁿ)，比任何指数函数增长都快，但比nⁿ慢。',
        relatedKnowledgePoint: '组合数学',
        hint: '斯特林公式给出了阶乘的渐近估计。'
      },
      {
        id: 'q-c14-unit-3',
        type: 'choice',
        question: '以下哪个是等价关系必须满足的三个性质？',
        options: [
          '自反性、对称性、传递性',
          '自反性、反对称性、传递性',
          '对称性、反对称性、传递性',
          '自反性、对称性、反对称性'
        ],
        correctAnswer: 0,
        explanation: '等价关系必须满足自反性、对称性、传递性。偏序关系要求自反性、反对称性、传递性。注意区分。',
        commonMisconception: '容易混淆等价关系和偏序关系的性质。',
        relatedKnowledgePoint: '等价关系与偏序关系',
        hint: '等价关系=自反+对称+传递。'
      },
      {
        id: 'q-c14-unit-4',
        type: 'judge',
        question: '鸽巢原理告诉我们，如果n+1个物品放入n个盒子中，至少有一个盒子中有2个以上物品。',
        correctAnswer: '正确',
        explanation: '鸽巢原理（抽屉原理）的基本形式：将n+1个物品放入n个盒子，至少有一个盒子包含至少2个物品。',
        relatedKnowledgePoint: '鸽巢原理',
        hint: '鸽子比鸽巢多，必然有鸽巢住多只鸽子。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c15-pre',
    courseId: 15,
    type: 'pre-test',
    title: '概率论与数理统计 - 课前测评',
    questions: [
      {
        id: 'q-c15-pre-1',
        type: 'choice',
        question: '抛一枚均匀硬币两次，至少出现一次正面的概率是？',
        options: ['1/4', '1/2', '3/4', '1'],
        correctAnswer: 2,
        explanation: '至少一次正面=1-P(两次都反面)=1-(1/2)²=1-1/4=3/4。用对立事件计算更简便。',
        commonMisconception: '有人直接算1/2+1/2=1，这是错误的，因为事件不互斥。',
        relatedKnowledgePoint: '古典概率',
        hint: '用对立事件：1减去"两次都是反面"的概率。'
      },
      {
        id: 'q-c15-pre-2',
        type: 'choice',
        question: '连续型随机变量的概率密度函数f(x)满足？',
        options: [
          'f(x)≤1',
          'f(x)≥0且∫f(x)dx=1',
          'f(x)在每一点都等于概率',
          'f(x)必须为常数'
        ],
        correctAnswer: 1,
        explanation: '概率密度函数满足非负性f(x)≥0和规范性∫f(x)dx=1。f(x)在单点的值不等于概率，概率是密度函数在区间上的积分。',
        commonMisconception: '有人以为f(x)的值就是概率，但密度函数值可以大于1。',
        relatedKnowledgePoint: '连续型随机变量',
        hint: '密度函数的两个基本性质是什么？'
      },
      {
        id: 'q-c15-pre-3',
        type: 'judge',
        question: '两个事件互斥则一定独立。',
        correctAnswer: '错误',
        explanation: '互斥和独立是不同的概念。互斥事件P(A∩B)=0，独立事件P(A∩B)=P(A)P(B)。若P(A)>0且P(B)>0，互斥反而不独立（因为P(A∩B)=0≠P(A)P(B)）。',
        commonMisconception: '很多人混淆互斥和独立，实际上互斥和独立在概率非零时是矛盾的。',
        relatedKnowledgePoint: '事件的关系与独立性',
        hint: '互斥意味着不能同时发生，独立意味着互不影响，两者含义不同。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c15-unit',
    courseId: 15,
    type: 'unit-test',
    title: '概率论与数理统计 - 单元测试',
    questions: [
      {
        id: 'q-c15-unit-1',
        type: 'choice',
        question: '正态分布N(μ,σ²)中，参数μ和σ²分别表示？',
        options: [
          '方差和均值',
          '均值和方差',
          '均值和标准差',
          '中位数和方差'
        ],
        correctAnswer: 1,
        explanation: 'N(μ,σ²)中μ是均值（期望），σ²是方差。注意σ²是方差不是标准差，标准差是σ。',
        commonMisconception: '有人混淆σ²和σ，前者是方差，后者是标准差。',
        relatedKnowledgePoint: '正态分布',
        hint: 'N(μ,σ²)中第二个参数是σ²不是σ。'
      },
      {
        id: 'q-c15-unit-2',
        type: 'choice',
        question: '贝叶斯公式P(A|B)=P(B|A)P(A)/P(B)中，P(A)称为？',
        options: ['后验概率', '先验概率', '条件概率', '联合概率'],
        correctAnswer: 1,
        explanation: 'P(A)是先验概率，表示在观察到B之前对A的信念。P(A|B)是后验概率，表示观察到B之后对A的更新信念。',
        relatedKnowledgePoint: '贝叶斯定理',
        hint: '先验=先于观察，后验=后于观察。'
      },
      {
        id: 'q-c15-unit-3',
        type: 'choice',
        question: '大数定律说明的是？',
        options: [
          '样本量越大，样本均值越接近总体均值',
          '样本量越大，方差越大',
          '所有分布都趋近正态分布',
          '小概率事件不会发生'
        ],
        correctAnswer: 0,
        explanation: '大数定律表明，当样本量趋于无穷时，样本均值依概率收敛于总体均值（期望）。中心极限定理才是说分布趋近正态。',
        commonMisconception: '有人混淆大数定律和中心极限定理。',
        relatedKnowledgePoint: '大数定律',
        hint: '大数定律关注的是均值的稳定性。'
      },
      {
        id: 'q-c15-unit-4',
        type: 'judge',
        question: '假设检验中，p值越小，拒绝原假设的证据越强。',
        correctAnswer: '正确',
        explanation: 'p值是在原假设成立条件下，观察到当前或更极端结果的概率。p值越小，说明在原假设下出现当前结果的可能性越低，拒绝原假设的证据越强。',
        relatedKnowledgePoint: '假设检验',
        hint: 'p值小意味着原假设下当前结果很"意外"。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c16-pre',
    courseId: 16,
    type: 'pre-test',
    title: '人工智能导论 - 课前测评',
    questions: [
      {
        id: 'q-c16-pre-1',
        type: 'choice',
        question: '人工智能的英文缩写是？',
        options: ['AL', 'AI', 'AR', 'AM'],
        correctAnswer: 1,
        explanation: 'AI是Artificial Intelligence的缩写，即人工智能。',
        relatedKnowledgePoint: '人工智能概述',
        hint: 'Artificial Intelligence的缩写。'
      },
      {
        id: 'q-c16-pre-2',
        type: 'choice',
        question: '以下哪个不属于人工智能的研究方向？',
        options: ['自然语言处理', '计算机视觉', '数据库管理', '机器学习'],
        correctAnswer: 2,
        explanation: '数据库管理属于传统计算机科学领域，不属于人工智能的核心研究方向。NLP、CV、ML都是AI的重要子领域。',
        relatedKnowledgePoint: 'AI研究领域',
        hint: '哪个方向更偏向数据存储而非智能？'
      },
      {
        id: 'q-c16-pre-3',
        type: 'judge',
        question: '图灵测试是判断机器是否具有智能的一种方法。',
        correctAnswer: '正确',
        explanation: '图灵测试由艾伦·图灵提出，如果机器能在对话中使人类无法区分其与人类的区别，则可以认为机器具有智能。',
        relatedKnowledgePoint: '图灵测试',
        hint: '图灵测试是AI领域最著名的智能判断标准。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c16-unit',
    courseId: 16,
    type: 'unit-test',
    title: '人工智能导论 - 单元测试',
    questions: [
      {
        id: 'q-c16-unit-1',
        type: 'choice',
        question: 'A*搜索算法中，f(n)=g(n)+h(n)，其中h(n)表示？',
        options: [
          '从起点到n的实际代价',
          '从n到目标点的估计代价',
          '从起点到目标点的总代价',
          'n节点的深度'
        ],
        correctAnswer: 1,
        explanation: 'A*算法中，g(n)是从起点到n的实际代价，h(n)是从n到目标的启发式估计代价，f(n)是总估计代价。',
        commonMisconception: '有人混淆g(n)和h(n)的含义。',
        relatedKnowledgePoint: '搜索算法',
        hint: 'g是已走过的代价，h是估计还要走的代价。'
      },
      {
        id: 'q-c16-unit-2',
        type: 'choice',
        question: '以下哪种方法属于无监督学习？',
        options: ['线性回归', '逻辑回归', 'K均值聚类', '支持向量机'],
        correctAnswer: 2,
        explanation: 'K均值聚类是无监督学习算法，不需要标签数据。线性回归、逻辑回归、SVM都是监督学习算法。',
        commonMisconception: '有人以为K均值需要标签，但聚类是无监督的。',
        relatedKnowledgePoint: '机器学习分类',
        hint: '哪种方法不需要训练标签？'
      },
      {
        id: 'q-c16-unit-3',
        type: 'choice',
        question: '专家系统的核心组成部分是？',
        options: [
          '知识库和推理机',
          '数据库和查询引擎',
          '编译器和解释器',
          '传感器和执行器'
        ],
        correctAnswer: 0,
        explanation: '专家系统由知识库（存储领域专家知识）和推理机（运用知识进行推理）两个核心部分组成。',
        relatedKnowledgePoint: '知识表示与推理',
        hint: '专家系统需要"知识"和"推理"两个核心。'
      },
      {
        id: 'q-c16-unit-4',
        type: 'judge',
        question: '强人工智能是指能在特定领域超越人类的AI系统。',
        correctAnswer: '错误',
        explanation: '强人工智能是指具有通用智能、能像人类一样思考和学习各种任务的AI。在特定领域超越人类的AI称为弱人工智能（窄AI）。',
        commonMisconception: '很多人混淆强AI和弱AI的定义。',
        relatedKnowledgePoint: 'AI分类',
        hint: '强AI=通用智能，弱AI=专用智能。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c17-pre',
    courseId: 17,
    type: 'pre-test',
    title: '机器学习 - 课前测评',
    questions: [
      {
        id: 'q-c17-pre-1',
        type: 'choice',
        question: '机器学习中，过拟合是指？',
        options: [
          '模型在训练集和测试集上表现都差',
          '模型在训练集上表现好但在测试集上表现差',
          '模型在训练集上表现差但在测试集上表现好',
          '模型参数太少'
        ],
        correctAnswer: 1,
        explanation: '过拟合是指模型过度拟合训练数据中的噪声和细节，导致泛化能力差，在未见过的测试数据上表现不好。',
        commonMisconception: '有人以为过拟合是模型在所有数据上表现差，那其实是欠拟合。',
        relatedKnowledgePoint: '过拟合与欠拟合',
        hint: '过拟合=学得"太好了"，连噪声都学了。'
      },
      {
        id: 'q-c17-pre-2',
        type: 'choice',
        question: '监督学习需要什么类型的数据？',
        options: [
          '只有输入特征',
          '带标签的输入输出对',
          '只有输出标签',
          '无任何标注的数据'
        ],
        correctAnswer: 1,
        explanation: '监督学习需要带标签的训练数据，即输入特征和对应的输出标签，模型通过学习输入输出的映射关系来进行预测。',
        relatedKnowledgePoint: '监督学习基础',
        hint: '监督学习中的"监督"来自标签。'
      },
      {
        id: 'q-c17-pre-3',
        type: 'judge',
        question: '交叉验证可以提高模型评估的可靠性。',
        correctAnswer: '正确',
        explanation: '交叉验证通过多次划分训练集和验证集，减少了单次划分的随机性影响，能更可靠地评估模型的泛化性能。',
        relatedKnowledgePoint: '模型评估方法',
        hint: '多次验证比单次验证更可靠。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c17-unit',
    courseId: 17,
    type: 'unit-test',
    title: '机器学习 - 单元测试',
    questions: [
      {
        id: 'q-c17-unit-1',
        type: 'choice',
        question: '梯度下降法中，学习率过大会导致？',
        options: [
          '收敛速度太慢',
          '可能越过最小值甚至发散',
          '一定找到全局最优',
          '过拟合'
        ],
        correctAnswer: 1,
        explanation: '学习率过大会导致步长太大，可能在最小值附近震荡甚至越过最小值导致发散。学习率过小则收敛太慢。',
        commonMisconception: '有人以为学习率大只会加快收敛，但过大会导致不稳定。',
        relatedKnowledgePoint: '优化算法',
        hint: '步子迈太大容易"跳过"目标。'
      },
      {
        id: 'q-c17-unit-2',
        type: 'choice',
        question: '逻辑回归虽然名字中有"回归"，但它实际上用于？',
        options: ['回归问题', '分类问题', '聚类问题', '降维问题'],
        correctAnswer: 1,
        explanation: '逻辑回归用于分类问题（通常是二分类），它通过sigmoid函数将线性输出映射到0-1之间的概率值，然后进行分类。',
        commonMisconception: '因为名字中有"回归"，很多人误以为它是回归算法。',
        relatedKnowledgePoint: '分类算法',
        hint: '逻辑回归输出的是概率，用于分类决策。'
      },
      {
        id: 'q-c17-unit-3',
        type: 'code',
        question: '使用Python实现一个简单的线性回归模型，使用梯度下降法训练，给定特征矩阵X和标签y。',
        correctAnswer: '实现梯度下降线性回归',
        explanation: '线性回归的假设函数为y=wx+b，使用MSE损失函数，通过梯度下降更新w和b。',
        relatedKnowledgePoint: '线性回归实现',
        codeTemplate: 'import numpy as np\ndef linear_regression(X, y, lr=0.01, epochs=100):\n    # 在此编写代码\n    pass',
        testCases: [
          { input: 'X=[[1],[2],[3]], y=[2,4,6]', expected: 'w≈2, b≈0' }
        ],
        hint: '初始化权重，循环计算预测值、损失和梯度，更新权重。'
      },
      {
        id: 'q-c17-unit-4',
        type: 'choice',
        question: '正则化L1和L2的区别是？',
        options: [
          'L1产生稀疏解，L2不会',
          'L2产生稀疏解，L1不会',
          '两者效果完全相同',
          'L1只用于分类，L2只用于回归'
        ],
        correctAnswer: 0,
        explanation: 'L1正则化（Lasso）倾向于产生稀疏解，可以将某些权重压缩为0，起到特征选择的作用。L2正则化（Ridge）倾向于让权重均匀变小，但不会变为0。',
        commonMisconception: '有人混淆L1和L2的稀疏性效果。',
        relatedKnowledgePoint: '正则化',
        hint: 'L1的菱形等高线容易在角上与损失函数相交，导致某些维度为0。'
      }
    ],
    timeLimitMinutes: 18
  },
  {
    id: 'assess-c18-pre',
    courseId: 18,
    type: 'pre-test',
    title: '深度学习 - 课前测评',
    questions: [
      {
        id: 'q-c18-pre-1',
        type: 'choice',
        question: '深度学习中的"深度"是指？',
        options: [
          '数据量很大',
          '神经网络有很多层',
          '学习时间很长',
          '模型参数很多'
        ],
        correctAnswer: 1,
        explanation: '"深度"指的是神经网络具有多个隐藏层，形成深层网络结构。深度学习通过多层非线性变换来学习数据的层次化表示。',
        relatedKnowledgePoint: '深度学习概述',
        hint: '"深"指的是网络的层数。'
      },
      {
        id: 'q-c18-pre-2',
        type: 'choice',
        question: '反向传播算法的作用是？',
        options: [
          '前向计算输出',
          '计算梯度以更新网络权重',
          '初始化网络参数',
          '选择网络结构'
        ],
        correctAnswer: 1,
        explanation: '反向传播算法通过链式法则计算损失函数对每个参数的梯度，用于在梯度下降中更新网络权重。',
        relatedKnowledgePoint: '反向传播',
        hint: '反向传播是"从后往前"传播误差。'
      },
      {
        id: 'q-c18-pre-3',
        type: 'judge',
        question: 'ReLU激活函数在输入为负时输出为0。',
        correctAnswer: '正确',
        explanation: 'ReLU(x)=max(0,x)，当输入x<0时输出0，当x≥0时输出x。这是最常用的激活函数之一。',
        relatedKnowledgePoint: '激活函数',
        hint: 'ReLU的定义是max(0,x)。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c18-unit',
    courseId: 18,
    type: 'unit-test',
    title: '深度学习 - 单元测试',
    questions: [
      {
        id: 'q-c18-unit-1',
        type: 'choice',
        question: '卷积神经网络(CNN)中，池化层的主要作用是？',
        options: [
          '增加特征图数量',
          '降低特征图的空间维度，减少参数量',
          '增加非线性',
          '归一化特征'
        ],
        correctAnswer: 1,
        explanation: '池化层（如最大池化、平均池化）降低特征图的空间尺寸，减少参数量和计算量，同时保留重要特征，增强模型的平移不变性。',
        relatedKnowledgePoint: 'CNN架构',
        hint: '池化是"缩小"特征图。'
      },
      {
        id: 'q-c18-unit-2',
        type: 'choice',
        question: 'Dropout技术的主要目的是？',
        options: [
          '加速训练',
          '防止过拟合',
          '增加模型容量',
          '减少训练数据'
        ],
        correctAnswer: 1,
        explanation: 'Dropout在训练时随机"丢弃"一部分神经元，防止神经元之间的共适应，是一种有效的正则化方法，主要用于防止过拟合。',
        relatedKnowledgePoint: '正则化技术',
        hint: 'Dropout=随机"丢弃"神经元，打破共适应。'
      },
      {
        id: 'q-c18-unit-3',
        type: 'choice',
        question: 'LSTM相比普通RNN的优势是？',
        options: [
          '计算速度更快',
          '参数更少',
          '能更好地处理长程依赖问题',
          '不需要训练数据'
        ],
        correctAnswer: 2,
        explanation: 'LSTM通过门控机制（遗忘门、输入门、输出门）控制信息的流动，有效缓解了RNN的梯度消失问题，能更好地捕捉长程依赖关系。',
        commonMisconception: '有人以为LSTM参数更少，实际上LSTM参数比普通RNN多。',
        relatedKnowledgePoint: '循环神经网络',
        hint: 'LSTM的"长短期记忆"解决了什么问题？'
      },
      {
        id: 'q-c18-unit-4',
        type: 'judge',
        question: 'Batch Normalization只能用于卷积神经网络，不能用于全连接网络。',
        correctAnswer: '错误',
        explanation: 'Batch Normalization既可以用于CNN，也可以用于全连接网络。它对每个mini-batch的数据进行归一化，加速训练并提供一定的正则化效果。',
        commonMisconception: '有人以为BN是CNN专用的，但BN适用于各种网络结构。',
        relatedKnowledgePoint: '批归一化',
        hint: 'BN是对mini-batch做归一化，与网络类型无关。'
      },
      {
        id: 'q-c18-unit-5',
        type: 'choice',
        question: 'Transformer模型的核心机制是？',
        options: [
          '循环连接',
          '卷积操作',
          '自注意力机制(Self-Attention)',
          '池化操作'
        ],
        correctAnswer: 2,
        explanation: 'Transformer的核心是自注意力机制，通过计算序列中每个位置与其他所有位置的相关性来捕获全局依赖关系，完全抛弃了循环和卷积结构。',
        relatedKnowledgePoint: 'Transformer架构',
        hint: 'Transformer的论文标题就是"Attention Is All You Need"。'
      }
    ],
    timeLimitMinutes: 20
  },
  {
    id: 'assess-c19-pre',
    courseId: 19,
    type: 'pre-test',
    title: '自然语言处理 - 课前测评',
    questions: [
      {
        id: 'q-c19-pre-1',
        type: 'choice',
        question: '自然语言处理(NLP)的主要目标是什么？',
        options: [
          '让计算机理解人类语言',
          '让人类理解计算机语言',
          '设计新的编程语言',
          '翻译编程语言'
        ],
        correctAnswer: 0,
        explanation: 'NLP的目标是让计算机能够理解、解释和生成人类语言，使人与计算机之间能用自然语言进行有效通信。',
        relatedKnowledgePoint: 'NLP概述',
        hint: 'NLP是让计算机"读懂"人类语言。'
      },
      {
        id: 'q-c19-pre-2',
        type: 'choice',
        question: '分词是NLP中哪个层面的任务？',
        options: ['语音层面', '词法层面', '句法层面', '语义层面'],
        correctAnswer: 1,
        explanation: '分词属于词法层面的任务，将连续文本切分为有意义的词语单元，是中文NLP的基础步骤。',
        relatedKnowledgePoint: '中文分词',
        hint: '分词处理的是"词"这个单位。'
      },
      {
        id: 'q-c19-pre-3',
        type: 'judge',
        question: 'Word2Vec是一种将词语映射为稠密向量的方法。',
        correctAnswer: '正确',
        explanation: 'Word2Vec通过神经网络将词语映射到低维稠密向量空间，使语义相近的词在向量空间中距离较近，是词嵌入的经典方法。',
        relatedKnowledgePoint: '词嵌入',
        hint: 'Word2Vec将词变成"向量"。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c19-unit',
    courseId: 19,
    type: 'unit-test',
    title: '自然语言处理 - 单元测试',
    questions: [
      {
        id: 'q-c19-unit-1',
        type: 'choice',
        question: 'BERT模型使用的是哪种预训练方式？',
        options: [
          '只使用语言模型（从左到右预测）',
          '掩码语言模型(MLM)和下一句预测(NSP)',
          '只使用下一句预测',
          '只使用掩码语言模型'
        ],
        correctAnswer: 1,
        explanation: 'BERT使用两种预训练任务：掩码语言模型(MLM)随机遮盖部分词并预测，以及下一句预测(NSP)判断两个句子是否相邻。',
        commonMisconception: '有人以为BERT只用MLM，但NSP也是其预训练的重要部分。',
        relatedKnowledgePoint: '预训练语言模型',
        hint: 'BERT的预训练有两个任务。'
      },
      {
        id: 'q-c19-unit-2',
        type: 'choice',
        question: '命名实体识别(NER)的任务是？',
        options: [
          '将文本分为正面和负面',
          '识别文本中的人名、地名、组织名等实体',
          '分析句子的语法结构',
          '将文本翻译成另一种语言'
        ],
        correctAnswer: 1,
        explanation: '命名实体识别是从文本中识别并分类专有名词，如人名(PER)、地名(LOC)、组织名(ORG)等，是信息抽取的基础任务。',
        relatedKnowledgePoint: '命名实体识别',
        hint: 'NER识别的是"命名实体"，即专有名词。'
      },
      {
        id: 'q-c19-unit-3',
        type: 'choice',
        question: '注意力机制在NLP中的核心思想是？',
        options: [
          '平等对待所有输入',
          '根据相关性对输入赋予不同权重',
          '只关注输入的第一个词',
          '随机选择关注的词'
        ],
        correctAnswer: 1,
        explanation: '注意力机制根据当前任务的需求，计算输入序列中各元素与当前输出的相关性，赋予不同的权重，使模型能聚焦于最相关的信息。',
        relatedKnowledgePoint: '注意力机制',
        hint: '注意力=有选择地"关注"重要信息。'
      },
      {
        id: 'q-c19-unit-4',
        type: 'judge',
        question: 'GPT模型使用的是单向（从左到右）的语言模型预训练方式。',
        correctAnswer: '正确',
        explanation: 'GPT使用单向自回归语言模型，从左到右预测下一个词，只能看到当前词左侧的上下文。BERT则是双向的。',
        commonMisconception: '有人混淆GPT和BERT的预训练方式，GPT是单向，BERT是双向。',
        relatedKnowledgePoint: 'GPT与BERT对比',
        hint: 'GPT是"生成式"的，自然是从左到右。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c20-pre',
    courseId: 20,
    type: 'pre-test',
    title: '计算机视觉 - 课前测评',
    questions: [
      {
        id: 'q-c20-pre-1',
        type: 'choice',
        question: '计算机视觉的主要目标是？',
        options: [
          '让计算机生成图像',
          '让计算机理解和分析图像与视频',
          '让计算机存储图像',
          '让计算机打印图像'
        ],
        correctAnswer: 1,
        explanation: '计算机视觉的目标是让计算机能够从图像或视频中提取有意义的信息，理解和分析视觉内容。',
        relatedKnowledgePoint: '计算机视觉概述',
        hint: 'CV是让计算机"看懂"图像。'
      },
      {
        id: 'q-c20-pre-2',
        type: 'choice',
        question: 'RGB图像中每个像素由几个通道组成？',
        options: ['1个', '2个', '3个', '4个'],
        correctAnswer: 2,
        explanation: 'RGB图像由红(R)、绿(G)、蓝(B)三个通道组成，每个通道通常用8位表示，取值0-255。',
        relatedKnowledgePoint: '图像基础',
        hint: 'RGB代表三种颜色。'
      },
      {
        id: 'q-c20-pre-3',
        type: 'judge',
        question: '图像分类是计算机视觉中最基础的任务之一。',
        correctAnswer: '正确',
        explanation: '图像分类是CV的基础任务，将整幅图像归入预定义的类别。目标检测、语义分割等更复杂的任务都建立在分类的基础上。',
        relatedKnowledgePoint: 'CV任务分类',
        hint: '分类是"这张图是什么"。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c20-unit',
    courseId: 20,
    type: 'unit-test',
    title: '计算机视觉 - 单元测试',
    questions: [
      {
        id: 'q-c20-unit-1',
        type: 'choice',
        question: '目标检测与图像分类的主要区别是？',
        options: [
          '目标检测不需要分类',
          '目标检测不仅分类还需要定位目标位置',
          '图像分类比目标检测更复杂',
          '两者完全相同'
        ],
        correctAnswer: 1,
        explanation: '图像分类只判断图像中有什么类别，目标检测不仅要分类还要用边界框(bounding box)定位每个目标的位置。',
        relatedKnowledgePoint: '目标检测',
        hint: '检测=分类+定位。'
      },
      {
        id: 'q-c20-unit-2',
        type: 'choice',
        question: '语义分割和实例分割的区别是？',
        options: [
          '语义分割更精确',
          '实例分割区分同类别的不同个体',
          '语义分割区分同类别的不同个体',
          '两者没有区别'
        ],
        correctAnswer: 1,
        explanation: '语义分割对每个像素分类但不区分同类的不同实例，实例分割既分类又区分同类别的不同个体。例如图中有3个人，语义分割将他们标为同一类，实例分割区分3个不同的人。',
        commonMisconception: '有人混淆语义分割和实例分割。',
        relatedKnowledgePoint: '图像分割',
        hint: '实例分割能区分"第一个人"和"第二个人"。'
      },
      {
        id: 'q-c20-unit-3',
        type: 'choice',
        question: 'YOLO算法的特点是？',
        options: [
          '两阶段检测，先提取候选区域再分类',
          '单阶段检测，将检测视为回归问题',
          '只能检测一个目标',
          '不需要训练数据'
        ],
        correctAnswer: 1,
        explanation: 'YOLO(You Only Look Once)是单阶段检测器，将目标检测视为回归问题，一次前向传播同时预测边界框和类别，速度快。',
        commonMisconception: '有人以为YOLO是两阶段检测器，但YOLO是单阶段的代表。',
        relatedKnowledgePoint: '目标检测算法',
        hint: 'YOLO的名字就暗示了"只看一次"。'
      },
      {
        id: 'q-c20-unit-4',
        type: 'judge',
        question: '数据增强（如翻转、旋转、裁剪）可以帮助缓解计算机视觉中的数据不足问题。',
        correctAnswer: '正确',
        explanation: '数据增强通过对现有图像进行变换（翻转、旋转、缩放、裁剪、颜色调整等）生成新的训练样本，有效扩充数据集，减少过拟合。',
        relatedKnowledgePoint: '数据增强',
        hint: '数据增强是"无中生有"制造更多训练数据。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c21-pre',
    courseId: 21,
    type: 'pre-test',
    title: '强化学习/生成式AI - 课前测评',
    questions: [
      {
        id: 'q-c21-pre-1',
        type: 'choice',
        question: '强化学习中，智能体通过什么信号来学习？',
        options: ['标签', '奖励(Reward)', '损失函数', '梯度'],
        correctAnswer: 1,
        explanation: '强化学习中智能体通过环境反馈的奖励信号来学习，目标是最大化累积奖励。这与监督学习通过标签学习不同。',
        relatedKnowledgePoint: '强化学习基础',
        hint: '强化学习的核心是"奖励驱动"。'
      },
      {
        id: 'q-c21-pre-2',
        type: 'choice',
        question: '生成式AI（如GPT、DALL-E）的核心能力是？',
        options: [
          '分类数据',
          '生成新的内容（文本、图像等）',
          '压缩数据',
          '搜索信息'
        ],
        correctAnswer: 1,
        explanation: '生成式AI的核心能力是学习数据的分布并生成新的、与训练数据相似但不同的内容，如文本、图像、音频等。',
        relatedKnowledgePoint: '生成式AI概述',
        hint: '"生成"就是创造新内容。'
      },
      {
        id: 'q-c21-pre-3',
        type: 'judge',
        question: 'Q-learning是一种基于值函数的强化学习方法。',
        correctAnswer: '正确',
        explanation: 'Q-learning通过学习状态-动作值函数Q(s,a)来选择最优策略，是一种基于值函数的off-policy方法。',
        relatedKnowledgePoint: 'Q-learning',
        hint: 'Q代表Quality，即动作的质量（价值）。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c21-unit',
    courseId: 21,
    type: 'unit-test',
    title: '强化学习/生成式AI - 单元测试',
    questions: [
      {
        id: 'q-c21-unit-1',
        type: 'choice',
        question: 'PPO(Proximal Policy Optimization)算法的特点是？',
        options: [
          '基于值函数的方法',
          '限制策略更新幅度，保证训练稳定性',
          '不需要环境交互',
          '只能用于离散动作空间'
        ],
        correctAnswer: 1,
        explanation: 'PPO通过裁剪目标函数限制新策略与旧策略的偏差，避免策略更新过大导致训练不稳定，是目前最常用的策略梯度方法之一。',
        relatedKnowledgePoint: '策略梯度方法',
        hint: 'PPO的"Proximal"就是"近端"的意思，限制更新别走太远。'
      },
      {
        id: 'q-c21-unit-2',
        type: 'choice',
        question: 'GAN(生成对抗网络)由哪两部分组成？',
        options: [
          '编码器和解码器',
          '生成器和判别器',
          '卷积层和池化层',
          '前向网络和反向网络'
        ],
        correctAnswer: 1,
        explanation: 'GAN由生成器(Generator)和判别器(Discriminator)组成，生成器试图生成逼真的假数据，判别器试图区分真假数据，两者对抗训练。',
        relatedKnowledgePoint: '生成对抗网络',
        hint: 'GAN=生成器vs判别器的对抗。'
      },
      {
        id: 'q-c21-unit-3',
        type: 'choice',
        question: 'RLHF(基于人类反馈的强化学习)在ChatGPT中的作用是？',
        options: [
          '预训练语言模型',
          '使模型输出更符合人类偏好',
          '减少模型参数量',
          '加速推理过程'
        ],
        correctAnswer: 1,
        explanation: 'RLHF通过人类对模型输出的偏好反馈来训练奖励模型，再用奖励模型指导强化学习，使模型生成更安全、有用、符合人类期望的回答。',
        relatedKnowledgePoint: 'RLHF',
        hint: 'RLHF让AI学会"人类喜欢什么样的回答"。'
      },
      {
        id: 'q-c21-unit-4',
        type: 'judge',
        question: '扩散模型(Diffusion Model)通过逐步添加噪声然后学习去噪来生成图像。',
        correctAnswer: '正确',
        explanation: '扩散模型包括前向过程（逐步添加高斯噪声）和反向过程（学习逐步去噪），通过去噪过程从纯噪声生成高质量图像。',
        relatedKnowledgePoint: '扩散模型',
        hint: '扩散模型的思路是"先加噪再去噪"。'
      },
      {
        id: 'q-c21-unit-5',
        type: 'choice',
        question: 'Transformer在生成式AI中被广泛使用，主要是因为？',
        options: [
          '计算量最小',
          '能高效处理长距离依赖和并行计算',
          '只需要少量数据',
          '不需要GPU'
        ],
        correctAnswer: 1,
        explanation: 'Transformer的自注意力机制能直接建模序列中任意位置间的依赖关系，且支持并行计算，相比RNN在长序列处理和训练效率上有显著优势。',
        relatedKnowledgePoint: 'Transformer与生成式AI',
        hint: 'Transformer解决了RNN的两个问题：长距离依赖和串行计算。'
      }
    ],
    timeLimitMinutes: 20
  },
  {
    id: 'assess-c22-pre',
    courseId: 22,
    type: 'pre-test',
    title: '计算机图形学 - 课前测评',
    questions: [
      {
        id: 'q-c22-pre-1',
        type: 'choice',
        question: '计算机图形学的主要研究内容是？',
        options: [
          '分析图像内容',
          '生成和操作视觉图像',
          '存储图像数据',
          '传输图像信号'
        ],
        correctAnswer: 1,
        explanation: '计算机图形学研究如何用计算机生成、处理和显示视觉图像，包括建模、渲染、动画等。图像分析是计算机视觉的范畴。',
        commonMisconception: '有人混淆计算机图形学（生成图像）和计算机视觉（理解图像）。',
        relatedKnowledgePoint: '图形学概述',
        hint: '图形学是"从数据到图像"，视觉是"从图像到理解"。'
      },
      {
        id: 'q-c22-pre-2',
        type: 'choice',
        question: '3D图形渲染管线的主要阶段不包括？',
        options: ['顶点处理', '光栅化', '片段处理', '图像识别'],
        correctAnswer: 3,
        explanation: '渲染管线包括顶点处理、图元装配、光栅化、片段处理等阶段。图像识别是计算机视觉的任务，不属于渲染管线。',
        relatedKnowledgePoint: '渲染管线',
        hint: '渲染管线是将3D数据变成2D图像的过程。'
      },
      {
        id: 'q-c22-pre-3',
        type: 'judge',
        question: '光栅化是将几何图元转换为像素的过程。',
        correctAnswer: '正确',
        explanation: '光栅化是将连续的几何图元（如三角形）转换为离散的像素（片段）的过程，是实时渲染管线的核心步骤。',
        relatedKnowledgePoint: '光栅化',
        hint: '光栅化=几何→像素。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c22-unit',
    courseId: 22,
    type: 'unit-test',
    title: '计算机图形学 - 单元测试',
    questions: [
      {
        id: 'q-c22-unit-1',
        type: 'choice',
        question: 'Phong光照模型包含哪三个分量？',
        options: [
          '红、绿、蓝',
          '环境光、漫反射、镜面反射',
          '直射光、散射光、透射光',
          '入射光、反射光、折射光'
        ],
        correctAnswer: 1,
        explanation: 'Phong光照模型由环境光(Ambient)、漫反射(Diffuse)和镜面反射(Specular)三个分量组成，是经典的局部光照模型。',
        relatedKnowledgePoint: '光照模型',
        hint: 'Phong模型的三个分量对应三种光照效果。'
      },
      {
        id: 'q-c22-unit-2',
        type: 'choice',
        question: '光线追踪(Ray Tracing)相比光栅化的优势是？',
        options: [
          '渲染速度更快',
          '能模拟全局光照效果（反射、折射、阴影等）',
          '不需要场景数据',
          '只能渲染简单场景'
        ],
        correctAnswer: 1,
        explanation: '光线追踪通过模拟光线路径来计算光照，能真实地模拟反射、折射、软阴影等全局光照效果，但计算量远大于光栅化。',
        commonMisconception: '有人以为光线追踪更快，实际上它比光栅化慢得多。',
        relatedKnowledgePoint: '光线追踪',
        hint: '光线追踪追求的是"真实感"而非"速度"。'
      },
      {
        id: 'q-c22-unit-3',
        type: 'choice',
        question: '齐次坐标在3D图形学中的主要用途是？',
        options: [
          '减少存储空间',
          '统一表示平移和线性变换为矩阵乘法',
          '提高渲染质量',
          '压缩纹理数据'
        ],
        correctAnswer: 1,
        explanation: '齐次坐标用n+1维向量表示n维点，使平移变换也能用矩阵乘法表示，从而将所有仿射变换统一为矩阵乘法，便于硬件加速。',
        relatedKnowledgePoint: '坐标变换',
        hint: '没有齐次坐标，平移需要加法，不能与旋转缩放统一为矩阵乘法。'
      },
      {
        id: 'q-c22-unit-4',
        type: 'judge',
        question: '贝塞尔曲线一定通过其所有控制点。',
        correctAnswer: '错误',
        explanation: '贝塞尔曲线只通过第一个和最后一个控制点，中间的控制点只影响曲线的形状，曲线不一定通过它们。只有插值曲线才通过所有控制点。',
        commonMisconception: '很多人以为贝塞尔曲线通过所有控制点。',
        relatedKnowledgePoint: '曲线与曲面',
        hint: '控制点是"引导"曲线的，不是曲线必须经过的点。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c23-pre',
    courseId: 23,
    type: 'pre-test',
    title: '信息安全基础 - 课前测评',
    questions: [
      {
        id: 'q-c23-pre-1',
        type: 'choice',
        question: '信息安全的CIA三要素不包括？',
        options: ['机密性(Confidentiality)', '完整性(Integrity)', '可用性(Availability)', '兼容性(Compatibility)'],
        correctAnswer: 3,
        explanation: 'CIA三要素是机密性、完整性、可用性。兼容性不是信息安全的核心要素。',
        relatedKnowledgePoint: '信息安全基础概念',
        hint: 'CIA=机密性+完整性+可用性。'
      },
      {
        id: 'q-c23-pre-2',
        type: 'choice',
        question: '以下哪种攻击方式属于被动攻击？',
        options: ['篡改数据', '拒绝服务攻击', '窃听', '伪造身份'],
        correctAnswer: 2,
        explanation: '窃听是被动攻击，只监听不修改数据。篡改、拒绝服务、伪造身份都是主动攻击，会改变系统状态或数据。',
        relatedKnowledgePoint: '攻击类型',
        hint: '被动攻击只"看"不"动"。'
      },
      {
        id: 'q-c23-pre-3',
        type: 'judge',
        question: '对称加密中，加密和解密使用相同的密钥。',
        correctAnswer: '正确',
        explanation: '对称加密使用同一密钥进行加密和解密，如AES、DES。非对称加密使用公钥加密、私钥解密，如RSA。',
        relatedKnowledgePoint: '加密技术',
        hint: '对称=两边一样，即同一把钥匙。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c23-unit',
    courseId: 23,
    type: 'unit-test',
    title: '信息安全基础 - 单元测试',
    questions: [
      {
        id: 'q-c23-unit-1',
        type: 'choice',
        question: '数字签名的主要作用是？',
        options: [
          '加密数据',
          '验证消息的完整性和发送者身份',
          '压缩数据',
          '加速传输'
        ],
        correctAnswer: 1,
        explanation: '数字签名使用发送者的私钥对消息摘要进行签名，接收者用公钥验证，从而确认消息未被篡改且确实来自声称的发送者。',
        relatedKnowledgePoint: '数字签名',
        hint: '数字签名=身份验证+完整性验证。'
      },
      {
        id: 'q-c23-unit-2',
        type: 'choice',
        question: 'SQL注入攻击的原理是？',
        options: [
          '暴力破解密码',
          '将恶意SQL代码插入输入字段中执行',
          '截获网络数据包',
          '利用系统漏洞提权'
        ],
        correctAnswer: 1,
        explanation: 'SQL注入是通过在用户输入中插入恶意SQL代码片段，使数据库执行非预期的SQL命令，从而获取或篡改数据。',
        relatedKnowledgePoint: 'Web安全',
        hint: 'SQL注入是"输入即代码"的典型例子。'
      },
      {
        id: 'q-c23-unit-3',
        type: 'choice',
        question: '以下哪种是防止密码被破解的最佳实践？',
        options: [
          '使用短且简单的密码',
          '使用加盐(salt)的哈希存储密码',
          '明文存储密码',
          '所有用户使用相同密码'
        ],
        correctAnswer: 1,
        explanation: '使用加盐哈希存储密码是最佳实践。盐是随机值，与密码拼接后哈希，防止彩虹表攻击和相同密码产生相同哈希值。',
        commonMisconception: '有人以为只做哈希就够了，但不加盐的哈希容易受彩虹表攻击。',
        relatedKnowledgePoint: '密码安全',
        hint: '"加盐"让相同密码的哈希值不同。'
      },
      {
        id: 'q-c23-unit-4',
        type: 'judge',
        question: '防火墙可以防御所有类型的网络攻击。',
        correctAnswer: '错误',
        explanation: '防火墙主要防御外部网络攻击，但无法防御内部攻击、社会工程学攻击、零日漏洞攻击等。没有单一安全措施能防御所有攻击。',
        commonMisconception: '有人以为有了防火墙就万无一失，但安全需要纵深防御。',
        relatedKnowledgePoint: '防火墙与网络安全',
        hint: '安全没有银弹，需要多层防护。'
      }
    ],
    timeLimitMinutes: 15
  },
  {
    id: 'assess-c24-pre',
    courseId: 24,
    type: 'pre-test',
    title: '大数据与云计算 - 课前测评',
    questions: [
      {
        id: 'q-c24-pre-1',
        type: 'choice',
        question: '大数据的"4V"特征不包括？',
        options: ['Volume(大量)', 'Velocity(高速)', 'Variety(多样)', 'Value(高价值)'],
        correctAnswer: 3,
        explanation: '大数据的4V特征是Volume(大量)、Velocity(高速)、Variety(多样)、Veracity(真实性)。Value虽然常被提及，但传统4V中第四个V是Veracity。',
        commonMisconception: '很多人记不清第四个V是Veracity还是Value。',
        relatedKnowledgePoint: '大数据概念',
        hint: '4V中有一个V关注的是数据的"真实性"。'
      },
      {
        id: 'q-c24-pre-2',
        type: 'choice',
        question: '云计算的三种服务模式是？',
        options: [
          'IaaS、PaaS、SaaS',
          'CPU、GPU、TPU',
          'LAN、WAN、MAN',
          'HTTP、FTP、SMTP'
        ],
        correctAnswer: 0,
        explanation: '云计算三种服务模式：IaaS(基础设施即服务)、PaaS(平台即服务)、SaaS(软件即服务)，从底层到上层依次提供不同级别的抽象。',
        relatedKnowledgePoint: '云计算服务模式',
        hint: 'IaaS/PaaS/SaaS分别对应基础设施/平台/软件即服务。'
      },
      {
        id: 'q-c24-pre-3',
        type: 'judge',
        question: 'Hadoop是一种分布式计算框架，可以处理大规模数据。',
        correctAnswer: '正确',
        explanation: 'Hadoop是开源的分布式计算框架，核心包括HDFS(分布式文件系统)和MapReduce(分布式计算框架)，专门用于处理大规模数据。',
        relatedKnowledgePoint: 'Hadoop生态系统',
        hint: 'Hadoop是大数据处理的标志性框架。'
      }
    ],
    timeLimitMinutes: 10
  },
  {
    id: 'assess-c24-unit',
    courseId: 24,
    type: 'unit-test',
    title: '大数据与云计算 - 单元测试',
    questions: [
      {
        id: 'q-c24-unit-1',
        type: 'choice',
        question: 'MapReduce的Map阶段和Reduce阶段分别做什么？',
        options: [
          'Map排序数据，Reduce过滤数据',
          'Map将数据拆分并并行处理，Reduce汇总Map的结果',
          'Map存储数据，Reduce读取数据',
          'Map加密数据，Reduce解密数据'
        ],
        correctAnswer: 1,
        explanation: 'Map阶段将输入数据拆分成独立的数据块并行处理，生成键值对；Reduce阶段将Map输出的相同键的值进行合并汇总。',
        relatedKnowledgePoint: 'MapReduce编程模型',
        hint: 'Map=分而治之，Reduce=合而为一。'
      },
      {
        id: 'q-c24-unit-2',
        type: 'choice',
        question: '以下哪种是NoSQL数据库？',
        options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
        correctAnswer: 2,
        explanation: 'MongoDB是文档型NoSQL数据库。MySQL、PostgreSQL、Oracle都是传统的关系型数据库(RDBMS)。',
        relatedKnowledgePoint: 'NoSQL数据库',
        hint: 'NoSQL=Not Only SQL，MongoDB是代表。'
      },
      {
        id: 'q-c24-unit-3',
        type: 'choice',
        question: '虚拟化技术的核心思想是？',
        options: [
          '增加硬件数量',
          '将物理资源抽象为逻辑资源，实现资源隔离和共享',
          '加密所有数据',
          '减少网络带宽'
        ],
        correctAnswer: 1,
        explanation: '虚拟化技术将物理资源（CPU、内存、存储等）抽象为逻辑资源，通过Hypervisor在多个虚拟机之间分配和管理资源，实现隔离和共享。',
        relatedKnowledgePoint: '虚拟化技术',
        hint: '虚拟化让一台物理机变成多台"虚拟机"。'
      },
      {
        id: 'q-c24-unit-4',
        type: 'judge',
        question: 'Spark比Hadoop MapReduce快，主要是因为Spark使用了内存计算。',
        correctAnswer: '正确',
        explanation: 'Spark将中间数据存储在内存中，避免了MapReduce每个阶段都要读写磁盘的开销，因此迭代计算任务速度比MapReduce快很多。',
        commonMisconception: '有人以为Spark只是MapReduce的简单替代，但内存计算是关键区别。',
        relatedKnowledgePoint: 'Spark与MapReduce对比',
        hint: 'Spark的RDD可以在内存中缓存，减少磁盘I/O。'
      },
      {
        id: 'q-c24-unit-5',
        type: 'choice',
        question: '容器技术（如Docker）与虚拟机的主要区别是？',
        options: [
          '容器需要更多资源',
          '容器共享宿主机内核，虚拟机有独立内核',
          '容器比虚拟机更安全',
          '容器不能运行应用'
        ],
        correctAnswer: 1,
        explanation: '容器共享宿主机操作系统内核，通过命名空间和控制组实现隔离，更轻量级。虚拟机运行独立的操作系统内核，隔离性更强但资源开销更大。',
        commonMisconception: '有人以为容器和虚拟机完全等价，但隔离级别不同。',
        relatedKnowledgePoint: '容器技术',
        hint: '容器=共享内核的轻量隔离，虚拟机=独立内核的完整隔离。'
      }
    ],
    timeLimitMinutes: 20
  }
]
