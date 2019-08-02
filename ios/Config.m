//
//  Config.m
//  shape
//
//  Created by Yuki Matsushita on 8/1/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "Config.h"

@implementation Config

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  BOOL isDebug = NO;
#if DEBUG
  isDebug = YES;
#endif
  return @{ @"DEBUG": @(isDebug) };
}

@end
