## Introduction

직방 IoT Platform Auth Protocol 에서 정의하는 Key URI 포멧은 아래의 형식을 갖습니다.

```
onepass://VERSION/LABEL?PARAMETERS
```

<br>

### Examples

일반적으로 사용되는 Key URI

```
onepass://1.1/soma-lounge:iot@zigbang.com?secret=2vAg7tkavkWefp67zMdNtWjQl8&issuer=soma-lounge
```

-   패스코드의 Secret Key를 생성하기 위한 기본 해시 알고리즘은 **HMACSHA1** 입니다.
-   패스코드의 기본 유효 기간은 **30초** 입니다.

Optional Parameters 을 이용하여 해시 알고리즘 및 유효시간과 같은 파리미터를 설정할 수 있습니다.

```
onepass://1.1/soma-lounge:iot@zigbang.com?secret=2vAg7tkavkWefp67zMdNtWjQl8&issuer=soma-lounge&algorithm=HMACSHA256&period=60
```

-   패스코드의 Secret Key를 생성하기 위하여 HMACSHA256 알고리즘을 사용했습니다.
-   패스코드의 유효 기간은 60초 입니다.

<br>
<br>

## Version

Auth Protocol 의 버전 정보를 나타냅니다.

<br>
<br>

## Label

Label 정보는 연관된 account 정보를 식별하기 위하여 사용됩니다. 기본적으로 사용자 계정 정보를 포함하며 선택적으로 해당 계정을 관리하는 공급자 또는 서비스를 식별하기 위한 문자열을 접두사로 붙여서 사용합니다.

서비스 접두사와 사용자 계정 정보 사이는 “:” 을 이용하여 구분합니다.

```
soma-lounge:iot@zigbang.com
```

관리자 또는 서비스 구분을 위한 정보를 접두사 형태로 붙이는 이유는 서로 다른 서비스에 동일한 계정이 사용됨으로 충돌될 수 있는 가능성을 없애기 위한 목적을 갖습니다.

<br>
<br>

## Parameters

### Secret

`REQUIRED` 속성이며 HMAC 해시 알고리즘을 통해 생성된 임의의 키 값입니다.

<br>

### Issuer

OPTIONAL 속성이며 패스코드의 관리자/공급자 또는 서비스 정보를 포함합니다. Label 의 접두사를 이용하여 해당 정보를 포함할 수 있기 때문에 파라미터로는 생략이 가능하지만 두 값이 서로 다른 값을 가질 수는 없습니다. 서비스 공급자 정보는 충돌 가능한 계정을 구분하기 위하여 필요한 정보로 OPTIONAL 정보이지만 가능하면 반드시 포함해서 사용하는 것을 권장합니다.

<br>

### Algorithm

OPTIONAL 속성이며 지원되는 해시 알고리즘은 아래와 같습니다.

-   HMACSHA1 (default)
-   HMACSHA256

<br>

### Period

OPTIONAL 속성이며 패스 코드의 유효 기간을 의미하며 시간단위는 초를 사용합니다.

-   30 초 (default)
