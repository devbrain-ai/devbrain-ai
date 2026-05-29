import { spinner } from '@clack/prompts';

/**
 * 统一管理终端的加载动画
 */
export function showSpinner(message: string) {
  const s = spinner();
  s.start(message);
  
  return {
    /**
     * 停止动画
     * @param msg 停止时显示的提示文字
     * @param _code 留着这个参数兼容 commit.ts 的调用，加下划线表示暂不使用，规避 TS 报错
     */
    stop(msg: string, _code: number = 0) {
      // clack 的 stop 只接收一个字符串参数，这里我们完美兼容它
      s.stop(msg);
    }
  };
}