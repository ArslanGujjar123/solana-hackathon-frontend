'use client';
/* eslint-disable react-hooks/static-components */

import * as React from 'react';
import { motion, isMotionComponent, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

type AnyProps = Record<string, unknown>;

type DOMMotionProps = Omit<HTMLMotionProps<keyof HTMLElementTagNameMap>, 'ref'>;

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps = {
  children?: React.ReactNode;
} & DOMMotionProps;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps(childProps: AnyProps, slotProps: DOMMotionProps): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className as string,
      slotProps.className as string,
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

const motionComponentCache = new Map<
  React.ElementType,
  React.ComponentType<AnyProps>
>();

function getMotionComponent(type: React.ElementType) {
  const cached = motionComponentCache.get(type);
  if (cached) return cached;

  const created = motion.create(type);
  motionComponentCache.set(type, created as React.ComponentType<AnyProps>);
  return created;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    const isValidChild = React.isValidElement(children);
    const childType = (isValidChild ? children.type : 'div') as React.ElementType;

    const isAlreadyMotion =
      typeof childType === 'object' &&
      childType !== null &&
      isMotionComponent(childType);

    const Base = React.useMemo(
      () =>
        isAlreadyMotion
          ? childType
          : getMotionComponent(childType),
      [isAlreadyMotion, childType],
    );

    if (!isValidChild) return null;

    const { ref: childRef, ...childProps } = children.props as AnyProps;

    const mergedProps = mergeProps(childProps, props);

    return (
      <Base
        {...mergedProps}
        ref={mergeRefs(childRef as React.Ref<HTMLElement>, ref)}
      />
    );
  },
);

Slot.displayName = 'Slot';

export {
  Slot,
  type SlotProps,
  type WithAsChild,
  type DOMMotionProps,
  type AnyProps,
};
