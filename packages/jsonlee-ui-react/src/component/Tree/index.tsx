import {
  forwardRef,
  Key,
  ReactNode,
  Ref,
  RefAttributes,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import type { TreeInstance, TreeProps } from '@/types/tree';
import { Tree as ATree, type TreeProps as ATreeProps } from 'antd';
import {} from 'antd/es/tree';
import { useBoolean, useSafeState } from 'ahooks';
import { arrTransform, flatEach, flatFilterByChildren, treeFlatten } from 'jsonlee-utils';
import { AnyObject } from '@/types/global';

// TODO: 性能优化的时候可将 onCheck、onExpand 等事件处理逻辑可以提取为自定义 Hook

const Tree = forwardRef(
  <T extends AnyObject = AnyObject>(
    {
      checked,
      treeData,
      optionsFormat,
      onCheckedAllChange,
      defaultExpandAll,
      virtual = true,
      ...props
    }: TreeProps<T>,
    ref: Ref<TreeInstance>,
  ) => {
    const [checkedInit, setCheckedInit] = useBoolean(false);
    const [expandedInit, setExpandedInit] = useBoolean(false);
    const [halfCheckedKeys, setHalfCheckedKeys] = useSafeState<Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useSafeState<Key[]>([]);
    const [expandedKeys, setExpandedKeys] = useSafeState<Key[]>([]);
    const [_checkedAll, setCheckedAll] = useBoolean(false);
    const options = useMemo<
      Exclude<TreeProps<T>['treeData'], undefined>
    >(() => {
      if (!treeData) return [];
      if (!optionsFormat) return treeData;
      return arrTransform<T>(treeData, optionsFormat, true);
    }, [optionsFormat, treeData]);
    const flattenOptions = useMemo<
      Exclude<TreeProps<T>['treeData'], undefined>
    >(() => {
      if (!options) return [];
      return treeFlatten(options, { keepChildren: true });
    }, [options]);
    // onCheck 事件
    const handleCheck = useCallback<
      Exclude<ATreeProps<T>['onCheck'], undefined>
    >(
      (_checked = [], { halfCheckedKeys: _halfCheckedKeys = [] }) => {
        const showKeys = flattenOptions.map((item) => item.key);
        const checkedSource = checkedKeys.filter(
          (id) => !showKeys.includes(id),
        );
        const halfCheckedSource = halfCheckedKeys.filter(
          (id) => !showKeys.includes(id),
        );
        const _checkedKeys = [...checkedSource, ...(_checked as Key[])];
        const _halfCheckedKeys_ = [
          ...halfCheckedSource,
          ...(_halfCheckedKeys as Key[]),
        ];
        setCheckedKeys(_checkedKeys);
        setHalfCheckedKeys(_halfCheckedKeys_);
      },
      [checkedKeys, flattenOptions, halfCheckedKeys],
    );
    // 处理全选
    const handleCheckAll = useCallback(() => {
      const arr = flattenOptions.map((item) => item.key);
      setCheckedKeys(arr);
      setHalfCheckedKeys([]);
    }, [flattenOptions]);
    // 处理全不选
    const handleUnCheckAll = useCallback(() => {
      const showKeys = flattenOptions.map((item) => item.key);
      const _checkedKeys = checkedKeys.filter((item) => !showKeys.includes(item));
      const _halfCheckedKeys = halfCheckedKeys.filter((item) => !showKeys.includes(item));
      setCheckedKeys(_checkedKeys);
      setHalfCheckedKeys(_halfCheckedKeys);
    }, [checkedKeys, flattenOptions, halfCheckedKeys]);
    // 处理展开
    const handleExpand = useCallback<
      Exclude<ATreeProps<T>['onExpand'], undefined>
    >(
      (_expandedKeys = []) => {
        const showKeys = flattenOptions.map((item) => item.key);
        const expandedKeysSource = expandedKeys.filter(
          (item) => !showKeys.includes(item),
        );
        setExpandedKeys([...expandedKeysSource, ..._expandedKeys]);
      },
      [expandedKeys, flattenOptions],
    );
    // 处理展开所有
    const handleExpandAll = useCallback(() => {
      const arr = flattenOptions
        .filter((item) => item.children && item.children.length)
        .map((item) => item.key);
      setExpandedKeys(arr);
    }, [flattenOptions]);
    const getCheckedKeys = useCallback(() => {
      return {
        checked: checkedKeys,
        halfChecked: halfCheckedKeys,
      };
    }, [checkedKeys, halfCheckedKeys]);
    // 处理 options 变化后 全选判断 根据children 和 checkedKeys去判断, 可能会并没有全选的情况下父级被选中
    useEffect(() => {
      if (options.length) {
        const abnormal: Key[] = [];
        flatEach(options, (item) => {
          if (item.children && item.children.length) {
            if (!item.children.every((childItem: T) => checkedKeys.includes(childItem.key))) {
              abnormal.push(item.key);
            }
          }
        });
        const _checkedKeys = checkedKeys.filter((item) => !abnormal.includes(item));
        if (_checkedKeys.length !== checkedKeys.length) {
          setCheckedKeys(_checkedKeys);
        }
      }
    }, [options, checkedKeys]);
    // 处理初始化 checked 数据
    useEffect(() => {
      if (!checkedInit && options.length && checked?.length) {
        const halfData = flatFilterByChildren(
          options,
          (item) => checked.includes(item.key),
          { deep: true },
        );
        const _halfKeys = treeFlatten(halfData)
          .map((item) => item.key)
          .filter((item) => !checked.includes(item));
        _halfKeys && _halfKeys.length && setHalfCheckedKeys(_halfKeys);
        setCheckedKeys(checked);
        setCheckedInit.setTrue();
      }
    }, [checked, checkedInit, options]);
    // 处理初始化 expanded 数据
    useEffect(() => {
      if (defaultExpandAll && !expandedInit && options.length) {
        handleExpandAll();
        setExpandedInit.setTrue();
      }
    }, [options, handleExpandAll, expandedInit, defaultExpandAll]);
    // 处理 checkedAll 数据
    useEffect(() => {
      if (flattenOptions.length) {
        const arr = flattenOptions
          .filter((item) => !(item.children && item.children.length))
          .map((item) => item.key);
        const flag = arr.every((item) => checkedKeys.includes(item));
        setCheckedAll.set(flag);
        onCheckedAllChange?.(flag);
      }
    }, [checkedKeys, flattenOptions, onCheckedAllChange]);
    // 暴露方法
    useImperativeHandle(
      ref,
      () => ({
        getCheckedKeys: getCheckedKeys,
        collapseAll: () => setExpandedKeys([]),
        expandAll: handleExpandAll,
        checkAll: () => handleCheckAll(),
        unCheckAll: () => handleUnCheckAll(),
      }),
      [
        getCheckedKeys,
        handleCheckAll,
        handleExpandAll,
        handleUnCheckAll,
        setExpandedKeys,
      ],
    );
    return (
      <>
        <ATree<T>
          {...props}
          treeData={options}
          checkedKeys={checkedKeys}
          onCheck={handleCheck}
          expandedKeys={expandedKeys}
          onExpand={handleExpand}
          virtual={virtual}
        />
      </>
    );
  },
) as unknown as <T = AnyObject>(
  props: TreeProps<T> & RefAttributes<TreeInstance>,
) => ReactNode;

export default Tree;
