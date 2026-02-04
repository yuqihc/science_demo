import React from 'react';
import PracticeContainer from '../../components/practice/PracticeContainer';
import MultipleChoice from '../../components/practice/QuestionTypes/MultipleChoice';
import FillBlank from '../../components/practice/QuestionTypes/FillBlank';

const AddSubtractPractice = () => {
  
  const generateQuestions = () => {
    const questions = [];
    const uniqueId = Date.now();

    // Q1: Simple Addition (random a,b < 10)
    const a1 = Math.floor(Math.random() * 5) + 1; // 1-5
    const b1 = Math.floor(Math.random() * 4) + 1; // 1-4
    questions.push({
      id: `${uniqueId}-1`,
      text: `${a1} + ${b1} = ?`,
      component: <FillBlank placeholder="?" />,
      correctAnswer: (a1 + b1).toString(),
      explanation: `${a1} 合并 ${b1} 是 ${a1 + b1}。`
    });

    // Q2: Simple Subtraction (random a,b, a>b)
    const a2 = Math.floor(Math.random() * 5) + 5; // 5-9
    const b2 = Math.floor(Math.random() * 4) + 1; // 1-4
    questions.push({
      id: `${uniqueId}-2`,
      text: `${a2} - ${b2} = ?`,
      component: <FillBlank placeholder="?" />,
      correctAnswer: (a2 - b2).toString(),
      explanation: `从 ${a2} 里面去掉 ${b2}，还剩 ${a2 - b2}。`
    });

    // Q3: Word Problem (Subtraction)
    const birdsTotal = Math.floor(Math.random() * 4) + 5; // 5-8
    const birdsAway = Math.floor(Math.random() * 3) + 1; // 1-3
    const birdsLeft = birdsTotal - birdsAway;
    // Generate wrong options
    const options3 = [
      birdsLeft, 
      birdsLeft + 1, 
      birdsLeft - 1 >= 0 ? birdsLeft - 1 : birdsLeft + 2, 
      birdsTotal
    ].sort(() => Math.random() - 0.5);
    // Unique options hack
    const uniqueOptions3 = [...new Set(options3)].map(v => ({ value: v, label: `${v}只` }));

    questions.push({
      id: `${uniqueId}-3`,
      text: `树上有 ${birdsTotal} 只鸟，飞走了 ${birdsAway} 只，还剩几只？`,
      component: <MultipleChoice options={uniqueOptions3} />,
      correctAnswer: birdsLeft,
      explanation: `${birdsTotal} 减去 ${birdsAway} 等于 ${birdsLeft}。`
    });

    // Q4: Number Bonds (Split)
    const total4 = Math.floor(Math.random() * 3) + 6; // 6-8
    const part1 = Math.floor(Math.random() * (total4 - 2)) + 1;
    const part2 = total4 - part1;
    
    questions.push({
      id: `${uniqueId}-4`,
      text: `把 ${total4} 分成两部分，可以是：`,
      component: <MultipleChoice options={[
        { value: `${part1},${part2}`, label: `${part1} 和 ${part2}` },
        { value: `${part1+1},${part2}`, label: `${part1+1} 和 ${part2}` },
        { value: `${part1},${part2+1}`, label: `${part1} 和 ${part2+1}` },
        { value: `${part1-1},${part2}`, label: `${part1-1} 和 ${part2}` }
      ].sort(() => Math.random() - 0.5)} />,
      correctAnswer: `${part1},${part2}`,
      explanation: `${part1} + ${part2} = ${total4}，所以 ${total4} 可以分成 ${part1} 和 ${part2}。`
    });

    // Q5: Missing Addend
    const sum5 = 10;
    const known5 = Math.floor(Math.random() * 8) + 1; // 1-9
    questions.push({
      id: `${uniqueId}-5`,
      text: `${known5} + ( ? ) = ${sum5}`,
      component: <FillBlank placeholder="?" />,
      correctAnswer: (sum5 - known5).toString(),
      explanation: `${known5} 和 ${sum5 - known5} 是一对好朋友，合起来是 ${sum5}。`
    });

    return questions;
  };

  return (
    <PracticeContainer
      title="10以内加减法 - 练一练"
      generateQuestions={generateQuestions}
      backPath="/math/add-subtract"
      themeColor="green"
    />
  );
};

export default AddSubtractPractice;
