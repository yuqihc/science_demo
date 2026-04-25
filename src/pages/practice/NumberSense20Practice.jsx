import React from 'react';
import PracticeContainer from '../../components/practice/PracticeContainer';
import MultipleChoice from '../../components/practice/QuestionTypes/MultipleChoice';
import FillBlank from '../../components/practice/QuestionTypes/FillBlank';

const NumberSense20Practice = () => {
  
  const generateQuestions = () => {
    const questions = [];
    const uniqueId = Date.now();

    // Q1: Counting (randomize number 3-9)
    const countNum = Math.floor(Math.random() * 7) + 3;
    const countOptions = [countNum, countNum + 1, countNum - 1, countNum + 2].sort(() => Math.random() - 0.5);
    questions.push({
      id: `${uniqueId}-1`,
      text: `${"🍎 ".repeat(countNum)}\n数一数，有几个红苹果？`,
      component: <MultipleChoice options={countOptions.map(n => ({ value: n, label: `${n}个` }))} />,
      correctAnswer: countNum,
      explanation: `我们可以一个一个地数，总共有 ${countNum} 个。`
    });

    // Q2: Tens and Ones (randomize 11-19)
    const tenOnesNum = Math.floor(Math.random() * 9) + 11;
    const ones = tenOnesNum % 10;
    questions.push({
      id: `${uniqueId}-2`,
      text: `${tenOnesNum} 里面有几个十和几个一？`,
      component: <MultipleChoice options={[
        { value: `1,${ones}`, label: `1个十，${ones}个一` },
        { value: `${ones},1`, label: `${ones}个十，1个一` },
        { value: `10,${ones}`, label: `10个十，${ones}个一` },
        { value: `1,${ones}0`, label: `1个十，${ones}0个一` }
      ].sort(() => Math.random() - 0.5)} />,
      correctAnswer: `1,${ones}`,
      explanation: `${tenOnesNum} 可以分成 10 和 ${ones}，所以是 1 个十和 ${ones} 个一。`
    });

    // Q3: Comparison (randomize two distinct numbers 1-20)
    let n1 = Math.floor(Math.random() * 20) + 1;
    let n2 = Math.floor(Math.random() * 20) + 1;
    while(n1 === n2) n2 = Math.floor(Math.random() * 20) + 1;
    const sign = n1 > n2 ? ">" : "<";
    const signText = n1 > n2 ? "大于" : "小于";
    questions.push({
      id: `${uniqueId}-3`,
      text: `比较大小：${n1} ○ ${n2}`,
      component: <MultipleChoice options={[
        { value: ">", label: "＞ (大于)" },
        { value: "<", label: "＜ (小于)" },
        { value: "=", label: "＝ (等于)" }
      ]} />,
      correctAnswer: sign,
      explanation: `${n1} 比 ${n2} ${signText}。`
    });

    // Q4: Between Numbers (randomize range)
    const mid = Math.floor(Math.random() * 10) + 5; // 5-14
    const low = mid - 1;
    const high = mid + 1;
    questions.push({
      id: `${uniqueId}-4`,
      text: `哪个数字比 ${low} 大，但比 ${high} 小？`,
      component: <FillBlank placeholder="?" />,
      correctAnswer: mid.toString(),
      explanation: `${low} 和 ${high} 中间的数字是 ${mid}。`
    });

    // Q5: Sequence (randomize start)
    const start = Math.floor(Math.random() * 15) + 1;
    questions.push({
      id: `${uniqueId}-5`,
      text: `按顺序填空：${start}, ${start+1}, ( ? )`,
      component: <FillBlank placeholder="?" />,
      correctAnswer: (start+2).toString(),
      explanation: `${start+1} 后面的数字是 ${start+2}。`
    });

    return questions;
  };

  return (
    <PracticeContainer
      title="20以内数的认识 - 练一练"
      generateQuestions={generateQuestions}
      backPath="/math/number-sense-20"
      themeColor="orange"
    />
  );
};

export default NumberSense20Practice;
