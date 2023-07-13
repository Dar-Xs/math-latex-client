<template>
  <div class="q-pa-sm q-pt-md">
    <q-card class="q-mb-lg">
      <q-card-section>
        Katex Formula
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <KatexFormula :formula="formula" />
      </q-card-section>
    </q-card>
    <q-input v-model="formula" label="formula code" filled autogrow />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import KatexFormula from './KatexFormula.vue';

const formula = ref(String.raw`
函数$f(x)=x\sin x$, 设$k$为整数且$k\rightarrow\infty$时, 
当$x\neq k\pi$, $f(x)\rightarrow\infty$当$x=k\pi$时,
$f(x)=0$, 所以函数在定义域内无界, 当$x\rightarrow\infty$时不是无穷大, 极限也不存在.
$$
\begin{align*}
\frac{\partial u}{\partial t} &= \alpha \nabla^2 u + f(x, y, t) \\
\frac{\partial^2 v}{\partial x^2} + \frac{\partial^2 v}{\partial y^2} &= \frac{1}{c^2} \frac{\partial^2 v}{\partial t^2} \\
\int_{0}^{2\pi} \sin(x) \, dx &= -\cos(x) \Big|_{0}^{2\pi} = 0 \\
\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x &= e \\
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}^{-1} &= \frac{1}{ad - bc} \begin{pmatrix}
d & -b \\
-c & a
\end{pmatrix} \\
\end{align*}
$$

`);
</script>